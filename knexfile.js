const {
  DB_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE = 'kudos',
  MYSQL_USER = 'kudos',
  MYSQL_PASSWORD = 'kudos',
  MYSQL_DEBUG = false
} = process.env

const commonConfig = {
  client: 'mysql2',
  connection: {
    host: DB_HOST,
    port: MYSQL_PORT,
    database: MYSQL_DATABASE,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    debug: MYSQL_DEBUG
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './database/migrations'
  },
  seeds: {
    directory: './database/seeds'
  }
}

module.exports.development = { ...commonConfig }

module.exports.test = { ...commonConfig }

module.exports.staging = { ...commonConfig }

module.exports.production = { ...commonConfig }
