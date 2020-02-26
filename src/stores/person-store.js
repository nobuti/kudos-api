import storeTemplate, { defaultOrderBy } from './store-template'
import DatabaseError from '../errors/mysql/DatabaseError'
import knex from '../lib/database'
import { logger } from '../lib/logger'
import { to } from '../lib/to'

const TABLE = 'person'

const createPersonStore = storeTemplate(TABLE, {
  async get() {
    logger.debug(`Finding ${TABLE}`)

    let result = knex
      .select()
      .from(TABLE)
      .whereNot('person.status', 'deleted')
      .orderBy([defaultOrderBy])

    const [err, data] = await to(result)
    DatabaseError.assert(err)

    return data
  },

  async find(id) {
    logger.debug(`Getting ${TABLE} with ID "${id}"`)
    const [err, data] = await to(
      knex
        .select()
        .from(TABLE)
        .where('person.id', id)
        .first()
    )
    DatabaseError.assert(err)

    return data
  },

  async getByProperty(property) {
    logger.debug(
      `Getting ${TABLE} with "${Object.keys(property)[0]}" "${
        Object.values(property)[0]
      }"`
    )
    const [err, data] = await to(
      knex
        .select()
        .from(TABLE)
        .where(property)
        .andWhereNot('status', 'deleted')
        .first()
    )
    DatabaseError.assert(err)

    return data
  },

  async search(params, orderBy) {
    logger.debug(
      `Getting ${TABLE} with search criteria ${JSON.stringify(params)}`,
      orderBy
    )

    let result = knex(TABLE)
      .where(params)
      .andWhereNot('status', 'deleted')
    if (orderBy) result = result.orderBy(orderBy.field, orderBy.direction)
    const [err, data] = await to(result)
    DatabaseError.assert(err)

    return data
  },

  async create(data) {
    const [err, id] = await to(knex(TABLE).insert(data))
    DatabaseError.assert(err)

    const item = await knex(TABLE)
      .where({ id })
      .first()

    logger.debug(`Created new ${TABLE}`, item)
    return item
  },

  async update(id, data) {
    const [err] = await to(
      knex(TABLE)
        .where({ id })
        .andWhereNot('status', 'deleted')
        .update(data)
    )
    DatabaseError.assert(err)

    let item = await knex(TABLE)
      .where({ id })
      .first()

    logger.debug(`Updated ${TABLE} "${id}"`, item)
    return item
  },

  async remove(id) {
    const [err] = await to(
      knex(TABLE)
        .where({ id })
        .andWhereNot('status', 'deleted')
        .update({ status: 'deleted' })
    )
    DatabaseError.assert(err)

    logger.debug(`Logical deleted ${TABLE} "${id}"`)
  }
})

export default createPersonStore
