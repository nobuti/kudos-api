import { NotFound, BadRequest } from 'fejl'

import Service from './service-template'

const assertKudo = BadRequest.makeAssert('No kudo given')

export default class InteractionService extends Service {
  constructor(interactionStore) {
    super(interactionStore)
    this.entity = 'interaction'
    this.fields = ['id', 'kudo', 'person']
  }

  async getPeopleFromKudo(kudo) {
    assertKudo(kudo)
    return this.store
      .getPeopleFromKudo(kudo)
      .then(NotFound.makeAssert(`${this.entity} with kudo "${kudo}" not found`))
  }
}
