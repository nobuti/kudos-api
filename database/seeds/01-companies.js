const acme = {
  id: 1,
  name: 'Acme Inc.'
}

const factorial = {
  id: 2,
  name: 'Factorial'
}

const companies = [acme, factorial]

exports.companies = companies
exports.seed = (knex, Promise) => knex('company').insert(companies)
