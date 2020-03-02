import storeTemplate from './store-template'
import { logger } from '../lib/logger'
import knex from '../lib/database'
import { to } from '../lib/to'
import DatabaseError from '../errors/mysql/DatabaseError'

const TABLE = 'kudos'

const createKudoStore = storeTemplate(TABLE, {
  async get(ids) {
    logger.debug(`Finding ${TABLE}`)

    let result = knex
      .select('*')
      .from(TABLE)
      .whereIn('id', ids)

    const [err, data] = await to(result)
    DatabaseError.assert(err)

    return data
  },

  async searchByCompany(company, params, orderBy) {
    logger.debug(
      `Getting ${TABLE} with search criteria`,
      JSON.stringify(params)
    )

    let result = knex
      .select(`${TABLE}.*`)
      .from(TABLE)
      .leftJoin('person', 'kudos.owner', 'person.id')
      .where('person.company', company)
      .andWhere('person.status', 'enabled')

    if (params && Object.keys(params).length) result = result.where(params)
    if (orderBy) result = result.orderBy(orderBy.field, orderBy.direction)
    const [err, data] = await to(result)

    DatabaseError.assert(err)

    return data
  }
})

export default createKudoStore
