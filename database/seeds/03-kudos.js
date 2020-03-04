const one = {
  id: 1,
  owner: 1,
  message: 'Wadus!'
}

const two = {
  id: 2,
  owner: 1,
  message: 'Fantastic!'
}

const three = {
  id: 3,
  owner: 2,
  message: 'Fantastic!'
}

const kudos = [one, two, three]

exports.kudos = kudos
exports.seed = (knex, Promise) => {
  return knex('kudos').insert(kudos)
}
