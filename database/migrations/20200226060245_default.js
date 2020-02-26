exports.up = (knex, Promise) =>
  knex.schema
    .raw('SET SESSION time_zone="+00:00";')
    .raw('SET sql_mode=(SELECT REPLACE(@@sql_mode,"NO_ZERO_DATE", ""));')
    .raw('SET sql_mode=(SELECT REPLACE(@@sql_mode,"NO_ZERO_IN_DATE", ""));')

exports.down = (knex, Promise) => {}
