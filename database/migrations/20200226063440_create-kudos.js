const createTableKudos = knex =>
  knex.schema.createTable('kudos', table => {
    table.increments('id')
    table
      .integer('owner')
      .unsigned()
      .references('id')
      .inTable('person')
    table.string('message').defaultTo(null)
    table.bool('favorited').defaultTo(false)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table
      .timestamp('updated_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
  })

exports.up = knex => createTableKudos(knex)
exports.down = knex => knex.schema.dropTableIfExists('kudos')
