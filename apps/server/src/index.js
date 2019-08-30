import express from 'express'
import WebhooksApi from '@octokit/webhooks'

const webhooks = new WebhooksApi({
  secret: process.env.GITHUB_WEBHOOK_SECRET,
  path: '/event-handler',
})

webhooks.on('*', ({ id, name, payload }) => {
  console.log(name, 'event received')
})

const app = express()

app.use(webhooks.middleware)

app.listen(3000)
