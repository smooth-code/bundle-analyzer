import { Router } from 'express'
import axios from 'axios'
import asyncHandler from 'express-async-handler'
import bodyParser from 'body-parser'
import cors from 'cors'
import Octokit from '@octokit/rest'
import { User } from '../models'
import config from '../config'
import { synchronizeFromUserId } from '../jobs/synchronize'

const router = new Router()

const corsOptions = {
  origin: 'http://localhost:8080',
}

router.use(cors(corsOptions))

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

router.post(
  '/auth/github',
  bodyParser.json(),
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

function bearerToken(req, res, next) {
  req.token = null

  if (!req.headers || !req.headers.authorization) {
    next()
    return
  }

  const parts = req.headers.authorization.split(' ')
  if (parts.length === 2 && parts[0] === 'Bearer') {
    ;[, req.token] = parts
  }

  next()
}

function loggedUser(req, res, next) {
  req.user = null

  if (!req.token) {
    next()
    return
  }

  User.query()
    .where({ accessToken: req.token })
    .first()
    .then(user => {
      req.user = user
      next()
    })
    .catch(next)
}

export default [bearerToken, loggedUser, router]
