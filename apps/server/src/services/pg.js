import knex from 'knex'
import { Model, knexSnakeCaseMappers } from 'objection'
import config from '../config'

let knexInstance

export function connect() {
  if (!knexInstance) {
    knexInstance = knex({
      ...config.get('pg'),
      ...knexSnakeCaseMappers(),
    })
    Model.knex(knexInstance)
  }

  return knexInstance
}

export async function disconnect() {
  if (!knexInstance) {
    return
  }

  await knexInstance.destroy()
  knexInstance = null
}
