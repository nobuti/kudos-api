import { NotFound, BadRequest } from 'fejl'

import { pick } from 'lodash'

const assertId = BadRequest.makeAssert('No id given')

export default class Service {
  constructor(store) {
    this.store = store
  }

  async get() {
    return this.store.get()
  }

  async find(id) {
    assertId(id)
    return this.store
      .find(id)
      .then(NotFound.makeAssert(`${this.entity} with id "${id}" not found`))
  }

  async search(params, orderBy) {
    BadRequest.makeAssert('No search params given')(params)
    return this.store.search(params, orderBy)
  }

  async create(data) {
    BadRequest.assert(data, `No ${this.entity} payload given`)
    const picked = pick(data, this.fields)
    return this.store.create(picked)
  }

  async update(id, data) {
    assertId(id)
    BadRequest.assert(data, `No ${this.entity} payload given`)
    const picked = pick(data, this.fields)
    await this.find(id).then(entity =>
      NotFound.assert(
        entity && entity.status !== 'deleted',
        `${this.entity} with id "${id}" not found`
      )
    )
    return this.store.update(id, picked)
  }

  async remove(id) {
    await this.find(id).then(entity =>
      NotFound.assert(
        entity && entity.status !== 'deleted',
        `${this.entity} with id "${id}" not found`
      )
    )
    await this.store.remove(id)
    return {
      deleted: 'ok'
    }
  }
}
