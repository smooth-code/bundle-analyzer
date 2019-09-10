import * as pg from './pg'
import * as amqp from './amqp'

export async function disconnect() {
  await pg.disconnect()
  await amqp.disconnect()
}
