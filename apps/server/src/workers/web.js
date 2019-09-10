import '../init'

import http from 'http'
import config from '../config'
import { logger } from '../modules/util'
import { addTeardown } from '../modules/teardown'
import * as services from '../services'
import api from '../api'

const server = http.createServer(api)

server.listen(config.get('server.port'), err => {
  if (err) {
    throw err
  }

  logger.info(`Ready on http://localhost:${server.address().port}`)
})

addTeardown({
  callback: () => {
    return new Promise((resolve, reject) => {
      server.close(err => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  },
  nice: 2,
})

addTeardown({
  callback: () => services.disconnect(),
  nice: 1,
})
