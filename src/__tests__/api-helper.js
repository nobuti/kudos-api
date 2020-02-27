import axios from 'axios'

import config from '../config'
import { createServer } from '../lib/server'
import { logger } from '../lib/logger'
import AuthService from '../services/auth-service'
import createPersonStore from '../stores/person-store'
import createLoginStore from '../stores/login-store'
import PersonService from '../services/person-service'

const { API } = config
const setup = () => {
  const personService = new PersonService(createPersonStore())
  const loginStore = createLoginStore()

  const logger = {
    debug: jest.fn()
  }

  return new AuthService(personService, loginStore, logger)
}

const authService = setup()

const getTokens = async (baseURL, user) => {
  await axios.post(
    `${API}/auth/token`,
    {
      credential: user.email
    },
    {
      baseURL
    }
  )

  const tokens = await authService.loginStore.search({ person: user.id })
  return tokens && tokens.length ? tokens.pop() : null
}

const authenticate = async (baseURL, user) => {
  const tokens = await getTokens(baseURL, user)

  const response = await axios.post(`${API}/auth/validateTokens`, {
    ...tokens
  })
  const { token } = response.headers
  return token
}

/**
 * API helper to make it easier to test endpoints.
 */
export async function apiHelper(auth = { authentication: false, user: null }) {
  const server = await startServer()
  const baseURL = `http://127.0.0.1:${server.address().port}`

  let headers = {}
  let token = ''

  if (auth.authentication) {
    token = await authenticate(baseURL, auth.user)

    headers = Object.assign(headers, {
      Authorization: `Bearer ${token}`
    })
  }

  const client = axios.create({
    baseURL,
    headers
  })

  return {
    caught: catchAndLog, // Useful for logging failing requests
    client,
    // Person API:
    me: () => client.get(`${API}/person/me`).then(assertStatus(200)),
    findPerson: () => client.get(`${API}/person`).then(assertStatus(200)),
    findPersonPaginated: (perPage, page) =>
      client
        .get(`${API}/person?perPage=${perPage}&page=${page}`)
        .then(assertStatus(206)),
    getPerson: id => client.get(`${API}/person/${id}`).then(assertStatus(200)),
    getEmployeesByCompany: id =>
      client.get(`${API}/person/company/${id}`).then(assertStatus(200)),
    getEmployeesByCompanyPaginated: (id, perPage, page) =>
      client
        .get(`${API}/person/company/${id}?perPage=${perPage}&page=${page}`)
        .then(assertStatus(206)),
    searchPerson: params =>
      client.get(`${API}/person/search${params}`).then(assertStatus(200)),
    searchPersonPaginated: (perPage, page, params) =>
      client
        .get(`${API}/person/search?perPage=${perPage}&page=${page}${params}`)
        .then(assertStatus(206)),
    createPerson: data =>
      client.post(`${API}/person`, data).then(assertStatus(201)),
    updatePerson: (id, data) =>
      client.patch(`${API}/person/${id}`, data).then(assertStatus(200)),
    removePerson: id =>
      client.delete(`${API}/person/${id}`).then(assertStatus(200)),
    // Company API:
    findCompany: () => client.get(`${API}/company`).then(assertStatus(200)),
    findCompanyPaginated: (perPage, page) =>
      client
        .get(`${API}/company?perPage=${perPage}&page=${page}`)
        .then(assertStatus(206)),
    getCompany: id =>
      client.get(`${API}/company/${id}`).then(assertStatus(200)),
    searchCompany: params =>
      client.get(`${API}/company/search${params}`).then(assertStatus(200)),
    searchCompanyPaginated: (perPage, page, params) =>
      client
        .get(`${API}/company/search?perPage=${perPage}&page=${page}${params}`)
        .then(assertStatus(206)),
    createCompany: data =>
      client.post(`${API}/company`, data).then(assertStatus(201)),
    updateCompany: (id, data) =>
      client.patch(`${API}/company/${id}`, data).then(assertStatus(200)),
    removeCompany: id =>
      client.delete(`${API}/company/${id}`).then(assertStatus(200)),

    stop: () => server.close(),
    getTokens: user => getTokens(baseURL, user),
    authenticate: user => authenticate(baseURL, user)
  }
}

/**
 * Creates a status asserter that asserts the given status on the response,
 * then returns the response data.
 *
 * @param {number} status
 */
export function assertStatus(status) {
  return async function statusAsserter(resp) {
    if (resp.status !== status) {
      throw new Error(
        `Expected ${status} but got ${resp.status}: ${resp.request.method} ${
          resp.request.path
        }`
      )
    }
    return resp.data
  }
}

export function catchAndLog(err) {
  if (err.response) {
    logger.error(
      `Error ${err.response.status} in request ${err.response.request.method} ${
        err.response.request.path
      }`,
      err.response.data
    )
  }
  throw err
}

const startServer = async () => (await createServer()).listen()

afterAll(async () => {
  const server = await startServer()
  return new Promise(resolve => server.close(resolve))
})
