exports.up = async knex => {
  await knex.schema.table('builds', table => {
    table.uuid('base_build_id').index()
    table.foreign('base_build_id').references('builds.id')
  })
}

exports.down = async knex => {
  await knex.schema.table('builds', table => {
    table.dropColumn('base_build_id')
  })
}
