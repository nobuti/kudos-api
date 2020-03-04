import axios from 'axios'
import jwt from 'jsonwebtoken'

import config from '../config'
import { createServer } from '../lib/server'
import { logger } from '../lib/logger'
import AuthService from '../services/auth-service'
import createPersonStore from '../stores/person-store'
import createLoginStore from '../stores/login-store'
import PersonService from '../services/person-service'

const { API } = config
const secret = process.env.JWT_SECRET

const setup = () => {
  const personStore = createPersonStore()
  const personService = new PersonService(personStore)
  const loginStore = createLoginStore()
  const authService = new AuthService(personService, loginStore, logger)

  return {
    personStore,
    personService,
    authService
  }
}

const entities = setup()
const { authService } = entities

const getTokens = async (baseURL, user) => {
  await axios.post(
    `${API}/auth/token`,
    {
      credential: user.email
    },
    {
      baseURL
    }
  )

  const [tokens] = await authService.loginStore.search(
    { person: user.id },
    { field: 'created_at', direction: 'desc' }
  )
  return tokens
}

const authenticate = async (baseURL, user) => {
  const tokens = await getTokens(baseURL, user)
  const response = await axios.post(`${API}/auth/validate`, tokens, { baseURL })
  const { token } = response.headers
  return token
}

/**
 * API helper to make it easier to test endpoints.
 */
export async function apiHelper(auth = { authentication: false, user: null }) {
  const server = await startServer()
  const baseURL = `http://127.0.0.1:${server.address().port}`

  let headers = {}

  if (auth.authentication) {
    const payload = { user: auth.user.id }
    // bypass passwordless system
    const token = jwt.sign(payload, secret)

    headers = Object.assign(headers, {
      Authorization: `Bearer ${token}`
    })
  }

  const client = axios.create({
    baseURL,
    headers
  })

  return {
    caught: catchAndLog, // Useful for logging failing requests
    client,
    entities,
    getTokens: user => getTokens(baseURL, user),
    authenticate: user => authenticate(baseURL, user),
    stop: () => server.close()
  }
}

/**
 * Creates a status asserter that asserts the given status on the response,
 * then returns the response data.
 *
 * @param {number} status
 */
export function assertStatus(status) {
  return async function statusAsserter(resp) {
    if (resp.status !== status) {
      throw new Error(
        `Expected ${status} but got ${resp.status}: ${resp.request.method} ${
          resp.request.path
        }`
      )
    }
    return resp.data
  }
}

export function catchAndLog(err) {
  if (err.response) {
    logger.error(
      `Error ${err.response.status} in request ${err.response.request.method} ${
        err.response.request.path
      }`,
      err.response.data
    )
  }
  throw err
}

const startServer = async () => (await createServer()).listen()

afterAll(async () => {
  const server = await startServer()
  return new Promise(resolve => server.close(resolve))
})
