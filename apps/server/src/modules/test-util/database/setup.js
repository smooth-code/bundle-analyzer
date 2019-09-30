import { truncate } from 'knex-scripts'
import * as pg from 'services/pg'

beforeAll(async () => {
  const knex = pg.connect()
  await knex.migrate.latest()
})

afterAll(async () => {
  await pg.disconnect()
})

beforeEach(async () => {
  await truncate({ getKnex: () => pg.createKnex() })
})
