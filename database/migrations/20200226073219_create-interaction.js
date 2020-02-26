const createTableReceivers = knex =>
  knex.schema.createTable('interaction', table => {
    table.increments('id')
    table
      .integer('kudo')
      .unsigned()
      .references('id')
      .inTable('kudos')
    table
      .integer('person')
      .unsigned()
      .references('id')
      .inTable('person')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table
      .timestamp('updated_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
  })

exports.up = knex => createTableReceivers(knex)
exports.down = knex => knex.schema.dropTableIfExists('interaction')
