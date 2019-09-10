exports.up = async knex => {
  await knex.raw('create extension if not exists "uuid-ossp"')
  await knex.schema
    .createTable('users', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'))
      table.timestamps(false, true)
      table
        .integer('github_id')
        .notNullable()
        .index()
      table.string('access_token').index()
      table.string('email').index()
      table
        .string('login')
        .index()
        .notNullable()
      table.string('name')
    })
    .createTable('organizations', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'))
      table.timestamps(false, true)
      table
        .integer('github_id')
        .notNullable()
        .index()
      table.string('name')
      table
        .string('login')
        .index()
        .notNullable()
    })
    .createTable('user_organization_rights', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'))
      table.timestamps(false, true)
      table.uuid('user_id').index()
      table.foreign('user_id').references('users.id')
      table.uuid('organization_id').index()
      table.foreign('organization_id').references('organizations.id')
    })
    .createTable('repositories', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'))
      table.timestamps(false, true)
      table
        .integer('github_id')
        .notNullable()
        .index()
      table.string('name').notNullable()
      table
        .boolean('active')
        .notNullable()
        .defaultTo(false)
        .index()
      table
        .boolean('archived')
        .notNullable()
        .defaultTo(false)
        .index()
      table.string('token').notNullable()
      table.uuid('organization_id').index()
      table.foreign('organization_id').references('organizations.id')
      table.uuid('user_id').index()
      table.foreign('user_id').references('users.id')
      table
        .boolean('private')
        .notNullable()
        .index()
      table
        .string('baseline_branch')
        .notNullable()
        .defaultTo('master')
      table.json('size_check_config').notNullable()
    })
    .createTable('user_repository_rights', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'))
      table.timestamps(false, true)
      table.uuid('user_id').index()
      table.foreign('user_id').references('users.id')
      table.uuid('repository_id').index()
      table.foreign('repository_id').references('repositories.id')
    })
    .createTable('installations', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'))
      table.timestamps(false, true)
      table
        .integer('github_id')
        .notNullable()
        .index()
      table
        .boolean('deleted')
        .notNullable()
        .defaultTo(false)
    })
    .createTable('synchronizations', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'))
      table.timestamps(false, true)
      table.uuid('installation_id').index()
      table.foreign('installation_id').references('installations.id')
      table.uuid('user_id').index()
      table.foreign('user_id').references('users.id')
      table
        .string('job_status')
        .notNullable()
        .index()
      table
        .string('type')
        .notNullable()
        .index()
    })
    .createTable('builds', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'))
      table.timestamps(false, true)
      table
        .uuid('repository_id')
        .notNullable()
        .index()
      table.foreign('repository_id').references('repositories.id')
      table
        .string('name')
        .notNullable()
        .defaultTo('default')
        .index()
      table
        .string('branch')
        .notNullable()
        .index()
      table
        .string('commit')
        .notNullable()
        .index()
      table
        .string('job_status')
        .notNullable()
        .index()
      table
        .integer('number')
        .notNullable()
        .index()
      table.integer('github_check_run_id')
      table.string('conclusion').index()
      table.json('provider_metadata')
      table.json('stats').notNullable()
      table.json('commit_info').notNullable()
      table.json('size_check_config').notNullable()
    })
    .createTable('user_installation_rights', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'))
      table.timestamps(false, true)
      table
        .uuid('user_id')
        .notNullable()
        .index()
      table.foreign('user_id').references('users.id')
      table
        .uuid('installation_id')
        .notNullable()
        .index()
      table.foreign('installation_id').references('installations.id')
    })
    .createTable('installation_repository_rights', table => {
      table
        .uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'))
      table.timestamps(false, true)
      table
        .uuid('installation_id')
        .notNullable()
        .index()
      table.foreign('installation_id').references('installations.id')
      table
        .uuid('repository_id')
        .notNullable()
        .index()
      table.foreign('repository_id').references('repositories.id')
    })
}

exports.down = knex =>
  knex.schema
    .dropTableIfExists('user_organization_rights')
    .dropTableIfExists('user_repository_rights')
    .dropTableIfExists('user_installation_rights')
    .dropTableIfExists('installation_repository_rights')
    .dropTableIfExists('builds')
    .dropTableIfExists('repositories')
    .dropTableIfExists('organizations')
    .dropTableIfExists('synchronizations')
    .dropTableIfExists('users')
    .dropTableIfExists('installations')
