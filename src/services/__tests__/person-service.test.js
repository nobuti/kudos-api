import PersonService from '../person-service'
import createPersonStore from '../../stores/person-store'
import { people } from '../../../database/seeds/02-person'

let mockedContext
const setup = () => {
  return new PersonService(createPersonStore())
}

describe('PersonService', () => {
  beforeEach(async () => {
    mockedContext = {
      request: {
        jwt: {
          user: 1
        }
      }
    }
  })

  it('get people only from my company', async () => {
    const personService = setup()
    const people = await personService.get(mockedContext)
    people.forEach(person => {
      expect(person.company).toEqual(people[0].company)
    })
  })

  it('find person properly', async () => {
    const personService = setup()
    const person = await personService.find(people[2].id)
    expect(person).toEqual(expect.objectContaining(people[2]))
  })

  it('find person by property', async () => {
    const personService = setup()
    const person = await personService.getByProperty({ email: people[2].email })
    expect(person).toEqual(expect.objectContaining(people[2]))
  })
})
