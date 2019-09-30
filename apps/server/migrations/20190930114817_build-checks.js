exports.up = async knex => {
  await knex.schema.createTable('build_checks', table => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.timestamps(false, true)
    table.integer('github_id').index()
    table.uuid('build_id').index()
    table.foreign('build_id').references('builds.id')
    table.string('conclusion')
    table.string('name')
    table
      .string('job_status')
      .notNullable()
      .index()
  })

  await knex.schema.table('builds', table => {
    table.dropColumn('github_check_run_id')
  })
}

exports.down = async knex => {
  await knex.schema.dropTableIfExists('build_checks')
  await knex.schema.table('builds', table => {
    table.integer('github_check_run_id')
  })
}
