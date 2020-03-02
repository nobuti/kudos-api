import storeTemplate from './store-template'
import { logger } from '../lib/logger'
import knex from '../lib/database'
import { to } from '../lib/to'
import DatabaseError from '../errors/mysql/DatabaseError'

const TABLE = 'interaction'

const createInteractionStore = storeTemplate(TABLE, {
  async getPeopleFromKudo(kudo) {
    logger.debug(`Getting kudo's ${kudo} people from ${TABLE}`)

    let result = knex
      .select('person.*')
      .from(TABLE)
      .leftJoin('person', 'person.id', 'interaction.person')
      .where('person.status', 'enabled')
      .where('kudo', kudo)

    const [err, data] = await to(result)

    DatabaseError.assert(err)

    return data
  }
})

export default createInteractionStore
