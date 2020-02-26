import { createController } from 'awilix-koa'

import config from '../config'

const api = personService => ({
  me: async ctx => ctx.ok(await personService.get(ctx.session.user)),
  getPeople: async ctx => ctx.ok(await personService.get(ctx.query)),
  findPerson: async ctx => ctx.ok(await personService.find(ctx.params.id)),
  searchPeople: async ctx => ctx.ok(await personService.search(ctx.query)),
  createPerson: async ctx =>
    ctx.created(await personService.create(ctx.request.body)),
  updatePerson: async ctx =>
    ctx.ok(await personService.update(ctx.params.id, ctx.request.body)),
  removePerson: async ctx => ctx.ok(await personService.remove(ctx.params.id))
})

export default createController(api)
  .prefix(`${config.API}/person`)
  .get('/me', 'me')
  .get('', 'getPeople')
  .get('/search', 'searchPeople')
  .get('/:id', 'findPerson')
  .post('', 'createPerson')
  .patch('/:id', 'updatePerson')
  .delete('/:id', 'removePerson')
