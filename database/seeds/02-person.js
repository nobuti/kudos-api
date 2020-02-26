const alice = {
  id: 1,
  name: 'Alice',
  lastName: 'Andersen',
  email: 'alice@wadus.co',
  company: 1
}

const buti = {
  id: 2,
  name: 'Buti',
  lastName: 'Lon',
  email: 'bob@wadus.co',
  company: 1
}

const carol = {
  id: 3,
  name: 'Carol',
  lastName: 'Corinto',
  email: 'carol@wadus.co',
  company: 1
}

const dave = {
  id: 4,
  name: 'Dave',
  lastName: 'Drake',
  email: 'dave@wadus.co',
  company: 2
}

const laurie = {
  id: 5,
  name: 'Laura',
  lastName: 'Doe',
  email: 'laura@wadus.co',
  company: 1
}

const factorial = {
  id: 6,
  name: 'Factorial',
  lastName: 'Team',
  email: 'factorial@wadus.co',
  company: 2
}

const people = [alice, buti, carol, dave, laurie, factorial]

exports.people = people
exports.seed = (knex, Promise) => {
  return knex('person').insert(people)
}
