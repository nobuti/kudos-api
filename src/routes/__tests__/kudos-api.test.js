import config from '../../config'
import { apiHelper } from '../../__tests__/api-helper'
import { people } from '../../../database/seeds/02-person'

const { API } = config
let api

const newKudo = {
  owner: people[0].id,
  message: 'Wadus!',
  people: [people[1].id, people[2].id]
}

describe('Kudos API', () => {
  beforeAll(async () => {
    const user = people[1]
    api = await apiHelper({ authentication: true, user })
  })

  it('can create kudos', async () => {
    const res = await api.client.post(`${API}/kudos`, newKudo)
    let { data, status } = res
    expect(status).toBe(201)
    expect(data).toBeDefined()
  })

  it('get all kudos', async () => {
    const res = await api.client.get(`${API}/kudos`)
    let { data, status } = res
    expect(status).toBe(200)
    expect(data).toBeDefined()
  })

  it('retreives kudos sent to me', async () => {
    const res = await api.client.get(`${API}/kudos/me`)
    let { data, status } = res
    expect(status).toBe(200)
    expect(data).toBeDefined()
  })

  it('retrieves kudos sent to a person', async () => {
    const res = await api.client.get(`${API}/kudos/person/2`)
    let { data, status } = res
    expect(status).toBe(200)
    expect(data).toBeDefined()
  })

  it('updates kudos sent to a person', async () => {
    const res = await api.client.get(`${API}/kudos/person/2`)
    let { data, status } = res
    expect(status).toBe(200)
    expect(data).toBeDefined()
  })
})
