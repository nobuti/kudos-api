import { logger } from '../lib/logger'
import { to } from '../lib/to'
import DatabaseError from '../errors/mysql/DatabaseError'
import knex from '../lib/database'

export const defaultOrderBy = { column: 'created_at', order: 'desc' }

const storeTemplate = (table, extend) => {
  if (!table) throw new Error('storeTemplate invoked without param "table"')

  const base = {
    async get() {
      logger.debug(`Finding ${table}`)

      let result = knex
        .select('*')
        .from(table)
        .orderBy([defaultOrderBy])
      const [err, data] = await to(result)
      DatabaseError.assert(err)

      return data
    },

    async find(id) {
      logger.debug(`Getting ${table} with ID "${id}"`)
      const [err, data] = await to(
        knex(table)
          .where({ id })
          .first()
      )
      DatabaseError.assert(err)

      return data
    },

    async getByProperty(property) {
      logger.debug(
        `Getting ${table} with "${Object.keys(property)[0]}" "${
          Object.values(property)[0]
        }"`
      )
      let data = await knex(table)
        .where(property)
        .first()
      return data
    },

    async search(params, orderBy) {
      logger.debug(
        `Getting ${table} with search criteria ${JSON.stringify(params)}`,
        orderBy
      )

      let result = knex(table).where(params)
      if (orderBy) result = result.orderBy(orderBy.field, orderBy.direction)
      const [err, data] = await to(result)
      DatabaseError.assert(err)

      return data
    },

    async create(data) {
      const [err, id] = await to(knex(table).insert(data))
      DatabaseError.assert(err)

      const item = await knex(table)
        .where({ id })
        .first()

      logger.debug(`Created new item in ${table}:  "${item}"`)
      return item
    },

    async update(id, data) {
      const [err] = await to(
        knex(table)
          .where({ id })
          .update(data)
      )
      DatabaseError.assert(err)

      let item = await knex(table)
        .where({ id })
        .first()
      logger.debug(`Updated ${table} "${id}"`, item)
      return item
    },

    async remove(id) {
      const [err] = await to(
        knex(table)
          .where({ id })
          .del()
      )
      DatabaseError.assert(err)

      logger.debug(`Removed ${table} "${id}"`)
    }
  }

  return () => {
    return extend
      ? {
          ...base,
          ...extend
        }
      : base
  }
}

export default storeTemplate
