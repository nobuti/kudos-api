import { BadRequest } from 'fejl'

import Service from './service-template'
import SessionError from '../errors/session-error'
import { pick } from '../utils'

const assertByUser = BadRequest.makeAssert('No user to filter by')

export default class KudoService extends Service {
  constructor(kudoStore, personService, interactionService) {
    super(kudoStore)
    this.personService = personService
    this.interactionService = interactionService
    this.entity = 'kudos'
    this.fields = ['id', 'owner', 'message', 'favorited', 'people']
  }

  async get(ctx) {
    SessionError.assert(ctx.request.jwt)
    const { user } = ctx.request.jwt
    const me = await this.personService.find(user)
    const kudos = await this.store.searchByCompany(me.company)

    for (let kudo of kudos) {
      kudo.people = await this.interactionService.getPeopleFromKudo(kudo.id)
    }

    return kudos
  }

  async getByPerson(user) {
    assertByUser(user)
    const interactions = await this.interactionService.search({ person: user })
    const kudosIds = interactions.map(interaction => interaction.kudo)
    const kudos = await this.store.get(kudosIds)

    for (let kudo of kudos) {
      kudo.people = await this.interactionService.getPeopleFromKudo(kudo.id)
    }

    return kudos
  }

  async create(data) {
    const { people, ...rest } = pick(data, this.fields)
    const kudo = await this.store.create(rest)
    for (let person of people) {
      await this.interactionService.create({ kudo: kudo.id, person })
    }

    kudo.people = []
    for (let person of people) {
      const user = await this.personService.find(person)
      kudo.people.push(user)
    }

    return kudo
  }
}
