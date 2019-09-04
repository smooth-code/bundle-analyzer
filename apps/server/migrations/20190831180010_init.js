exports.up = knex =>
  knex.schema
    .createTable('users', table => {
      table.bigincrements('id').primary()
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
      table.bigincrements('id').primary()
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
      table.bigincrements('id').primary()
      table.timestamps(false, true)
      table.bigInteger('user_id').index()
      table.foreign('user_id').references('users.id')
      table.bigInteger('organization_id').index()
      table.foreign('organization_id').references('organizations.id')
    })
    .createTable('repositories', table => {
      table.bigincrements('id').primary()
      table.timestamps(false, true)
      table
        .integer('github_id')
        .notNullable()
        .index()
      table.string('name').notNullable()
      table
        .boolean('enabled')
        .notNullable()
        .defaultTo(false)
        .index()
      table.string('token').notNullable()
      table.bigInteger('organization_id').index()
      table.foreign('organization_id').references('organizations.id')
      table.bigInteger('user_id').index()
      table.foreign('user_id').references('users.id')
      table
        .boolean('private')
        .notNullable()
        .index()
      table
        .string('baseline_branch')
        .notNullable()
        .defaultTo('master')
    })
    .createTable('user_repository_rights', table => {
      table.bigincrements('id').primary()
      table.timestamps(false, true)
      table.bigInteger('user_id').index()
      table.foreign('user_id').references('users.id')
      table.bigInteger('repository_id').index()
      table.foreign('repository_id').references('repositories.id')
    })
    .createTable('installations', table => {
      table.bigincrements('id').primary()
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
      table.bigincrements('id').primary()
      table.timestamps(false, true)
      table.bigInteger('installation_id').index()
      table.foreign('installation_id').references('installations.id')
      table.bigInteger('user_id').index()
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
    .createTable('bundle_infos', table => {
      table.bigincrements('id').primary()
      table.timestamps(false, true)
      table
        .bigInteger('repository_id')
        .notNullable()
        .index()
      table.foreign('repository_id').references('repositories.id')
      table
        .string('branch')
        .notNullable()
        .index()
      table
        .string('commit')
        .notNullable()
        .index()
    })
    .createTable('user_installations', table => {
      table.bigincrements('id').primary()
      table.timestamps(false, true)
      table
        .bigInteger('user_id')
        .notNullable()
        .index()
      table.foreign('user_id').references('users.id')
      table
        .bigInteger('installation_id')
        .notNullable()
        .index()
      table.foreign('installation_id').references('installations.id')
    })

exports.down = knex =>
  knex.schema
    .dropTableIfExists('user_organization_rights')
    .dropTableIfExists('user_repository_rights')
    .dropTableIfExists('bundle_infos')
    .dropTableIfExists('repositories')
    .dropTableIfExists('organizations')
    .dropTableIfExists('synchronizations')
    .dropTableIfExists('users')
    .dropTableIfExists('installations')
    .dropTableIfExists('user_installations')
