import express from 'express'
import { formatters } from 'express-err'
import cors from 'cors'
import auth from './auth'
import webhooks from './webhooks'
import errorHandler from './errorHandler'
import build from './build'
import { apolloServer } from '../graphql'

const app = express()

app.use(
  cors({
    origin: process.env.APP_BASE_URL,
  }),
)

app.use(webhooks)
app.use(auth)
app.use(build)

apolloServer.applyMiddleware({ app })

app.use(
  errorHandler({
    formatters: {
      json: formatters.json,
      default: formatters.json,
    },
  }),
)

export default app
