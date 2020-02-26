const STATUS = ['disabled', 'enabled']

const createTablePerson = knex =>
  knex.schema.createTable('person', table => {
    table.increments('id')
    table.string('name').notNullable()
    table.string('lastName').notNullable()
    table
      .string('email')
      .unique()
      .notNullable()
    table.enu('status', STATUS).defaultTo('enabled')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table
      .timestamp('updated_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
  })

exports.up = knex => createTablePerson(knex)
exports.down = knex => knex.schema.dropTableIfExists('person')
