import { createController } from 'awilix-koa'

import config from '../config'

const { API } = config

const api = authService => ({
  token: async ctx => ctx.ok(await authService.token(ctx.request.body)),
  validateTokens: async ctx =>
    ctx.ok(await authService.validateTokens(ctx, ctx.request.body))
})

export default createController(api)
  .prefix(`${API}/auth`)
  .post('/token', 'token')
  .post('/validate', 'validateTokens')
