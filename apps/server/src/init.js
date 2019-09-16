/* eslint-disable no-console */

import 'dotenv/config'
import * as Sentry from '@sentry/node'
import config from './config'
import { connect as connectDatabase } from './services/pg'
import { handleKillSignals } from './modules/teardown'

// Initialize sentry
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: config.get('sentry.dsn'),
    environment: config.get('sentry.environment'),
    release: config.get('sentry.release'),
  })
}

connectDatabase()
handleKillSignals()
