import { createController } from 'awilix-koa'
import { isAuthenticated } from '../middleware/auth'

import config from '../config'

const api = personService => ({
  me: async ctx => {
    const { user } = ctx.request.jwt
    ctx.ok(await personService.find(user))
  },
  getPeople: async ctx => ctx.ok(await personService.get(ctx))
})

export default createController(api)
  .prefix(`${config.API}/person`)
  .before(isAuthenticated)
  .get('/me', 'me')
  .get('', 'getPeople')
