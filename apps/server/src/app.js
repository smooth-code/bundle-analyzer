import express from 'express'
import axios from 'axios'
import asyncHandler from 'express-async-handler'
import bodyParser from 'body-parser'
import cors from 'cors'
import WebhooksApi from '@octokit/webhooks'
import Octokit from '@octokit/rest'
import { User } from './models'
import config from './config'
import { handleGitHubEvents } from './modules/github'
import { synchronizeFromUserId } from './jobs/synchronize'

const webhooks = new WebhooksApi({
  secret: process.env.GITHUB_WEBHOOK_SECRET,
  path: '/event-handler',
})

webhooks.on('*', handleGitHubEvents)

const app = express()

app.use(webhooks.middleware)

app.use(cors())

app.use(bodyParser.json())

function getDataFromProfile(profile) {
  return {
    githubId: profile.id,
    login: profile.login,
    name: profile.name,
    email: profile.email,
  }
}

async function registerUserFromGitHub(accessToken) {
  const octokit = new Octokit({
    debug: config.get('env') === 'development',
    auth: accessToken,
  })

  const profile = await octokit.users.getAuthenticated()
  const userData = { ...getDataFromProfile(profile.data), accessToken }

  let user = await User.query()
    .where({ githubId: userData.githubId })
    .limit(1)
    .first()

  if (user) {
    await user.$query().patch(userData)
  } else {
    user = await User.query().insertAndFetch(userData)
  }

  await synchronizeFromUserId(user.id)
}

app.post(
  '/auth/github',
  asyncHandler(async (req, res) => {
    const result = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: req.body.code,
      },
      {
        headers: {
          accept: 'application/json',
        },
      },
    )

    if (result.data.error) {
      res.status(400)
      res.send(result.data)
      return
    }

    await registerUserFromGitHub(result.data.access_token)
    res.send(result.data)
  }),
)

export default app
