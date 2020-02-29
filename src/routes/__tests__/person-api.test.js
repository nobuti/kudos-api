import config from '../../config'
import { apiHelper } from '../../__tests__/api-helper'
import { people } from '../../../database/seeds/02-person'

const { API } = config
let api

describe('Person API', () => {
  describe('Non authenticated', () => {
    beforeAll(async () => {
      api = await apiHelper()
    })

    it('should raise an error', async () => {
      try {
        await await api.client.get(`${API}/person/me`)
      } catch (e) {
        const { status, data } = e.response
        expect(status).toBe(401)
        expect(data.message).toMatch(/Authorisation required/i)
      }
    })
  })

  describe('Authenticated', () => {
    beforeAll(async () => {
      const user = people[0]
      api = await apiHelper({ authentication: true, user })
    })

    it('should return my data properly', async () => {
      const { data, status } = await api.client.get(`${API}/person/me`)
      expect(status).toBe(200)
      expect(data.id).toEqual(people[0].id)
    })

    it('should return only people that belong to my company', async () => {
      const { data, status } = await api.client.get(`${API}/person`)
      expect(status).toBe(200)
      data.forEach(person => {
        expect(person.company).toEqual(people[0].company)
      })
    })
  })
})
