const createTableLogin = knex =>
  knex.schema.createTable('login', table => {
    table.increments('id')
    table.string('tokenDevice')
    table.string('tokenPublic')
    table.string('credential')
    table
      .integer('person')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('person')
    table.boolean('expired').defaultTo(false)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table
      .timestamp('updated_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    table.index(['tokenDevice'], 'tokenDevice_index')
    table.index(['tokenPublic'], 'tokenPublic_index')
  })

exports.up = knex => createTableLogin(knex)
exports.down = knex => knex.schema.dropTableIfExists('login')
