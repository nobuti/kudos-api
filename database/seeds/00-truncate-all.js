const TABLES1 = ['interaction', 'kudos', 'company']
const TABLES2 = ['person']

exports.seed = async knex => {
  for (const table of TABLES1) {
    await knex(table).del()
  }
  for (const table of TABLES2) {
    await knex(table).del()
  }
}
