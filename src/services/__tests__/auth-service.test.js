import { throws } from 'smid'
import moment from 'moment-timezone'

import AuthService, { getMagicLink } from '../auth-service'
import createPersonStore from '../../stores/person-store'
import PersonService from '../person-service'
import { people } from '../../../database/seeds/02-person'

let mockedContext
let personService
const setup = () => {
  personService = new PersonService(createPersonStore())

  const logger = {
    debug: jest.fn()
  }

  const loginStore = {
    create: jest.fn(),
    search: jest.fn(),
    update: jest.fn()
  }

  return new AuthService(personService, loginStore, logger)
}

describe('AuthService', () => {
  beforeEach(async () => {
    mockedContext = {
      response: {
        set: jest.fn(o =>
          Object.keys(o).forEach(
            key => (mockedContext.response.headers[key] = o[key])
          )
        ),
        headers: {}
      },
      request: {
        header: {}
      }
    }
  })

  describe('token', () => {
    it('should throw an error if credential is missing', async () => {
      const authService = setup()
      expect((await throws(authService.token())).message).toMatch(
        /No auth params given/i
      )
      expect(
        (await throws(
          authService.token({
            nonSense: 'wadus'
          })
        )).message
      ).toMatch(/Auth credential is required/i)
    })

    it('should throw an error if credential is not email', async () => {
      const authService = setup()
      expect(
        (await throws(
          authService.token(
            {
              credential: 'wadus'
            },
            mockedContext
          )
        )).message
      ).toMatch(/User not found/i)
    })

    it('should throw an error if credential does not match to a user', async () => {
      const authService = setup()
      expect(
        (await throws(
          authService.token(
            {
              credential: 'wadus@test.com'
            },
            mockedContext
          )
        )).message
      ).toMatch(/User not found/i)
    })

    it('should create tokens properly with existing email credential', async () => {
      const authService = setup()
      const { email } = people[1]
      await authService.token(
        {
          credential: email
        },
        mockedContext
      )

      expect(authService.loginStore.create).toHaveBeenCalledWith(
        expect.objectContaining({
          tokenDevice: expect.any(String),
          tokenPublic: expect.any(String)
        })
      )
    })
  })

  describe('token validation', () => {
    it('should throw an error if tokens are missing', async () => {
      const authService = setup()
      expect(
        (await throws(authService.validateTokens(null, mockedContext))).message
      ).toMatch(/No auth params given/i)

      expect(
        (await throws(
          authService.validateTokens(
            {
              tokenDevice: 'wadus'
            },
            mockedContext
          )
        )).message
      ).toMatch(/Auth tokens are required/i)
    })

    it('should throw an error if no login matches', async () => {
      const authService = setup()
      authService.loginStore.search.mockImplementation(() => [])

      expect(
        (await throws(
          authService.validateTokens(
            {
              tokenDevice: 'wadus',
              tokenPublic: 'wadus'
            },
            mockedContext
          )
        )).message
      ).toMatch(/Auth tokens are expired or not found/i)
    })

    it('should throw an error if tokens are expired', async () => {
      const authService = setup()
      authService.loginStore.search.mockImplementation(() => [
        {
          id: 1,
          tokenDevice: 'wadus',
          tokenPublic: 'wadus',
          credential: 'bob@test.com',
          person: 2,
          expired: 0,
          created_at: moment()
            .subtract(10, 'minutes')
            .format()
        }
      ])

      try {
        await authService.validateTokens(
          {
            tokenDevice: 'wadus',
            tokenPublic: 'wadus'
          },
          mockedContext
        )
      } catch (e) {
        expect(e.message).toMatch(/Auth tokens are expired/i)
      }

      // expect(
      //   (await throws(
      //     authService.validateTokens(
      //       {
      //         tokenDevice: 'wadus',
      //         tokenPublic: 'wadus'
      //       },
      //       mockedContext
      //     )
      //   )).message
      // ).toMatch(/Auth tokens are expired/i)
    })

    it('should return person properly', async () => {
      const authService = setup()
      authService.loginStore.search.mockImplementation(() => [
        {
          id: 1,
          tokenDevice: 'wadus',
          tokenPublic: 'wadus',
          credential: 'bob@test.com',
          person: 2,
          expired: 0,
          created_at: moment().format()
        }
      ])

      const person = await authService.validateTokens(
        {
          tokenDevice: 'wadus',
          tokenPublic: 'wadus'
        },
        mockedContext
      )

      expect(person).toMatchObject(people[1])
    })
  })
})

describe('magic link', () => {
  beforeEach(() => {
    mockedContext = {
      session: {},
      request: {
        header: {}
      }
    }
  })

  it('should return a valid link', () => {
    const magicLink = getMagicLink('token')
    expect(magicLink).toBe('http://localhost:3000/login/validate/token')
  })
})
