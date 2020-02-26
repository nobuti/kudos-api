import knex from 'knex'
import config from '../../knexfile'

const { NODE_ENV } = process.env

const dbConfig = config[NODE_ENV]
const db = knex(dbConfig)

export default db
