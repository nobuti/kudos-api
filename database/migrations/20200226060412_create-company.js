const STATUS = ['disabled', 'enabled']

const createTableCompany = knex =>
  knex.schema.createTable('company', table => {
    table.increments('id')
    table.string('name').notNullable()
    table.enu('status', STATUS).defaultTo('enabled')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table
      .timestamp('updated_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
  })

exports.up = knex => createTableCompany(knex)
exports.down = knex => knex.schema.dropTableIfExists('company')
