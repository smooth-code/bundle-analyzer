import express from 'express'
import { formatters } from 'express-err'
import auth from './auth'
import webhooks from './webhooks'
import errorHandler from './errorHandler'
import bundleInfo from './bundleInfo'

const app = express()

app.use(auth)
app.use(webhooks)
app.use(bundleInfo)

app.use(
  errorHandler({
    formatters: {
      json: formatters.json,
      default: formatters.json,
    },
  }),
)

export default app
