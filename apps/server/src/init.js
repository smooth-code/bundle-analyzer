/* eslint-disable no-console */

// import * as Sentry from '@sentry/node'
// import config from './config'
import 'dotenv/config'
import { connect as connectDatabase } from './services/pg'
import { handleKillSignals } from './modules/teardown'

// Initialize sentry
// Sentry.init({
//   dsn: config.get('sentry.serverDsn'),
//   environment: config.get('sentry.environment'),
//   release: config.get('releaseVersion'),
// })

connectDatabase()
handleKillSignals()
