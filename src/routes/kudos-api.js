import { createController } from 'awilix-koa'

import { isAuthenticated } from '../middleware/auth'
import config from '../config'

const { API } = config

const api = kudoService => ({
  getAll: async ctx => ctx.ok(await kudoService.get(ctx)),
  getAllOfUser: async ctx =>
    ctx.ok(await kudoService.getByPerson(ctx.params.user, ctx)),
  getMine: async ctx => {
    const { user } = ctx.request.jwt
    return ctx.ok(await kudoService.getByPerson(user, ctx))
  },
  create: async ctx => ctx.created(await kudoService.create(ctx.request.body))
})

export default createController(api)
  .prefix(`${API}/kudos`)
  .before(isAuthenticated)
  .get('/', 'getAll')
  .get('/me', 'getMine')
  .get('/person/:user', 'getAllOfUser')
  .post('/', 'create')
