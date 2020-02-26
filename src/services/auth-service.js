import { BadRequest, NotFound } from 'fejl'
import crypto from 'crypto'
import moment from 'moment-timezone'
import jwt from 'jsonwebtoken'

import config from '../config'
import { pick } from '../utils'

const secret = process.env.JWT_SECRET
const { TOKEN_LENGTH, TOKEN_EXPIRATION, PERSON_STATUS } = config

// Prevent overposting.
const pickProps = data =>
  pick(data, ['tokenDevice', 'tokenPublic', 'credential', 'person'])

const assertParams = BadRequest.makeAssert('No auth params given')

const validPerson = person =>
  person && person.status && person.status === PERSON_STATUS.ENABLED

const generateToken = async () => {
  const uuid = await new Promise((resolve, reject) => {
    crypto.randomBytes(TOKEN_LENGTH, (err, buffer) => {
      if (err) {
        reject(err)
      }
      const token = buffer.toString('hex')
      resolve(token)
    })
  })

  return uuid
}

export const getMagicLink = tokenPublic => {
  return `http://localhost:3000/login/validate/${tokenPublic}`
}

export default class AuthService {
  constructor(personService, loginStore, logger) {
    this.personService = personService
    this.loginStore = loginStore
    this.logger = logger
  }

  async token(params) {
    assertParams(params)
    const { credential } = params
    BadRequest.assert(credential, 'Auth credential is required')

    const person = await this.personService.getByProperty({ email: credential })
    NotFound.assert(validPerson(person), 'User not found')

    const tokenDevice = await generateToken()
    const tokenPublic = await generateToken()
    const picked = pickProps({
      tokenDevice,
      tokenPublic,
      credential,
      person: person.id
    })

    const magicLink = getMagicLink(tokenPublic)

    // send email in production
    this.logger.debug(`magicLink: ${magicLink}`)
    this.logger.debug(`tokenDevice: ${tokenDevice}`)
    this.logger.debug(`tokenPublic: ${tokenPublic}`)

    await this.loginStore.create(picked)

    return {
      tokenDevice
    }
  }

  async validateTokens(ctx, params) {
    assertParams(params)

    const { tokenDevice, tokenPublic } = params
    BadRequest.assert(tokenDevice && tokenPublic, 'Auth tokens are required')

    const logins = await this.loginStore.search({
      tokenDevice,
      tokenPublic,
      expired: false
    })

    const login = [].concat(logins).shift()
    BadRequest.assert(login, 'Auth tokens are expired or not found')

    // test if login is in the time window
    const createdAt = moment(login.created_at).utc()
    const now = moment().utc()

    BadRequest.assert(
      now.diff(createdAt, 'minutes') < TOKEN_EXPIRATION,
      'Auth tokens are expired'
    )

    await this.loginStore.update(login.id, {
      expired: true
    })

    const person = await this.personService.find(login.person)

    NotFound.assert(person, 'User not found')
    BadRequest.assert(
      validPerson(person),
      'Auth tokens are expired or not found'
    )
    const payload = { user: person.id }
    const token = jwt.sign(payload, secret)
    ctx.response.set({
      token
    })

    return person
  }
}
