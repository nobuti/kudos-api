import { BadRequest, NotFound } from 'fejl'

import Service from './service-template'

const assertId = BadRequest.makeAssert('No id given')
const assertByProperty = BadRequest.makeAssert('No property to filter by')

export default class PersonService extends Service {
  constructor(personStore) {
    super(personStore)
    this.entity = 'person'
    this.fields = ['id', 'name', 'lastName', 'email', 'status', 'company']
  }

  async find(id) {
    assertId(id)
    let person = await this.store
      .find(id)
      .then(NotFound.makeAssert(`${this.entity} with id "${id}" not found`))

    // Remove personal data
    if (person.status === 'deleted') {
      person = {
        ...person,
        name: person.name && '',
        lastName: person.lastName && '',
        email: person.email && ''
      }
    }
    return person
  }

  async getByProperty(property) {
    assertByProperty(property)
    return this.store.getByProperty(property)
  }

  async getByCompany(id) {
    BadRequest.makeAssert('No company id given')(id)

    return this.store.getByCompany(id)
  }
}
