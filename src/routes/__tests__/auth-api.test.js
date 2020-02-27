import config from '../../config'
import { apiHelper } from '../../__tests__/api-helper'
import { people } from '../../../database/seeds/02-person'

const { API } = config

describe('Auth API', () => {
  describe(`${API}/auth`, () => {
    it('should missing enpoint as not found', async () => {
      const { client } = await apiHelper()

      try {
        await client.get(`${API}/auth`)
      } catch (e) {
        const { status, data } = e.response
        expect(status).toBe(404)
        expect(data.message).toMatch(/No endpoint matched your request/i)
      }
    })
  })

  describe(`${API}/auth/token`, () => {
    it('should return public token properly', async () => {
      const api = await apiHelper()

      const res = await api.client.post(`${API}/auth/token`, {
        credential: people[0].email
      })

      let { data, status } = res
      expect(status).toBe(200)
      expect(data).toBeDefined()
    })

    it('should return user not found for no credential requests', async () => {
      const { client } = await apiHelper()

      try {
        await client.post(`${API}/auth/token`)
      } catch (e) {
        const { data, status } = e.response
        expect(data.message).toMatch(/Auth credential is required/i)
        expect(status).toBe(400)
      }
    })

    it('should return user not found if credential not matches', async () => {
      const { client } = await apiHelper()

      try {
        await client.post(`${API}/auth/token`, { credential: 'wadus' })
      } catch (e) {
        const { data, status } = e.response
        expect(data.message).toMatch(/User not found/i)
        expect(status).toBe(404)
      }
    })
  })

  describe(`${API}/auth/validate`, () => {
    it('should validate token properly', async () => {
      const api = await apiHelper()
      const tokens = await api.getTokens(people[0])

      const res = await api.client.post(`${API}/auth/validate`, { ...tokens })

      let { data, status } = res
      expect(status).toBe(200)
      expect(data).toBeDefined()
    })

    it('should raise an error if tokens are not provided', async () => {
      const { client } = await apiHelper()

      try {
        await client.post(`${API}/auth/validate`)
      } catch (e) {
        const { data, status } = e.response
        expect(data.message).toMatch(/Auth tokens are required/i)
        expect(status).toBe(400)
      }
    })

    it("should raise an error if tokens don't match", async () => {
      const { client } = await apiHelper()

      try {
        await client.post(`${API}/auth/validate`, {
          tokenDevice: 'wadus',
          tokenPublic: 'wadus'
        })
      } catch (e) {
        const { data, status } = e.response
        expect(data.message).toMatch(/Auth tokens are expired or not found/i)
        expect(status).toBe(400)
      }
    })
  })
})
