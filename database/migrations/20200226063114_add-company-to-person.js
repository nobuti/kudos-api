exports.up = async knex => {
  await knex.schema.table('person', table => {
    table
      .integer('company')
      .unsigned()
      .notNullable()
      .defaultTo(1)
      .references('id')
      .inTable('company')
  })

  await knex.raw(
    `CREATE TRIGGER delete_company BEFORE UPDATE ON company
    FOR EACH ROW
    BEGIN
    IF (NEW.status = 'deleted' AND OLD.status != 'deleted')
    THEN
      UPDATE person
        SET person.status = 'disabled'
        WHERE person.company = NEW.id;
    END IF;
    END;`
  )
}

exports.down = async knex => {
  await knex.schema.table('person', table => {
    table.dropForeign('company')
    table.dropColumn('company')
  })

  await knex.raw('DROP TRIGGER delete_company')
}
