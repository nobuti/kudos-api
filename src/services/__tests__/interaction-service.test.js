import InteractionService from '../interaction-service'
import createInteractionStore from '../../stores/interaction-store'

import { kudos } from '../../../database/seeds/03-kudos'
import { interactions } from '../../../database/seeds/04-interactions'

const setup = () => {
  return new InteractionService(createInteractionStore())
}

describe('InteractionService', () => {
  it('get people from kudo', async () => {
    const interactionService = setup()

    const people = await interactionService.getPeopleFromKudo(kudos[0].id)
    const peopleIds = people.map(person => person.id)

    expect(people).toBeDefined()
    expect(people.length).toBe(
      interactions.filter(
        interaction =>
          peopleIds.indexOf(interaction.person) >= 0 &&
          interaction.kudo === kudos[0].id
      ).length
    )

    people.forEach(person => {
      expect(person.id).toBeDefined()
      expect(person.name).toBeDefined()
      expect(person.email).toBeDefined()
    })
  })
})
