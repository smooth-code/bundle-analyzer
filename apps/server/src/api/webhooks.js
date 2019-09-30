import WebhooksApi from '@octokit/webhooks'
import { handleGitHubEvents } from 'modules/github'

const webhooks = new WebhooksApi({
  secret: process.env.GITHUB_WEBHOOK_SECRET,
  path: '/event-handler',
})

webhooks.on('*', handleGitHubEvents)

export default webhooks.middleware
