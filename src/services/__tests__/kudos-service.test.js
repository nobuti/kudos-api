import KudosService from '../kudo-service'
import PersonService from '../../services/person-service'
import InteractionService from '../../services/interaction-service'
import createPersonStore from '../../stores/person-store'
import createInteractionStore from '../../stores/interaction-store'
import createKudoStore from '../../stores/kudo-store'

import { people } from '../../../database/seeds/02-person'

const setup = () => {
  const personService = new PersonService(createPersonStore())
  const interactionService = new InteractionService(createInteractionStore())
  return new KudosService(createKudoStore(), personService, interactionService)
}

describe('KudosService', () => {
  let mockedContext
  beforeAll(async () => {
    mockedContext = {
      request: {
        jwt: {
          user: people[0].id
        }
      }
    }
  })

  it('get kudos restricted to my company', async () => {
    const kudosService = setup()
    const kudos = await kudosService.get(mockedContext)

    expect(kudos).toBeDefined()

    kudos.forEach(kudo => {
      kudo.people.forEach(person => {
        expect(person.company).toBe(people[0].company)
      })
    })
  })

  it('get kudos of person', async () => {
    const kudosService = setup()
    const kudos = await kudosService.getByPerson(people[1].id)

    expect(kudos).toBeDefined()

    kudos.forEach(kudo => {
      const peopleIds = kudo.people.map(person => person.id)
      expect(peopleIds.indexOf(people[1].id) >= 0).toBe(true)
    })
  })
})
