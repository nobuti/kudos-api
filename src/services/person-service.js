import { BadRequest, NotFound } from 'fejl'

import Service from './service-template'
import SessionError from '../errors/session-error'

const assertId = BadRequest.makeAssert('No id given')
const assertByProperty = BadRequest.makeAssert('No property to filter by')

export default class PersonService extends Service {
  constructor(personStore) {
    super(personStore)
    this.entity = 'person'
    this.fields = ['id', 'name', 'lastName', 'email', 'status', 'company']
  }

  async get(ctx) {
    SessionError.assert(ctx.request.jwt)
    const { user } = ctx.request.jwt
    const me = await this.store.find(user)
    return this.store.search({ company: me.company })
  }

  async find(id) {
    assertId(id)
    let person = await this.store
      .find(id)
      .then(NotFound.makeAssert(`${this.entity} with id "${id}" not found`))

    return person
  }

  async getByProperty(property) {
    assertByProperty(property)
    return this.store.getByProperty(property)
  }
}
