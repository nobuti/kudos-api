const oneone = {
  kudo: 1,
  person: 2
}

const twoone = {
  kudo: 1,
  person: 3
}

const two = {
  kudo: 2,
  person: 2
}

const onethree = {
  kudo: 3,
  person: 1
}

const threethree = {
  kudo: 3,
  person: 3
}

const interactions = [oneone, twoone, two, onethree, threethree]

exports.interactions = interactions
exports.seed = (knex, Promise) => {
  return knex('interaction').insert(interactions)
}
