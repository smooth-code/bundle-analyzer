/* eslint-disable no-restricted-syntax */
import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { HttpError } from 'express-err'
import bodyParser from 'body-parser'
import { Build, Bundle, Repository } from 'models'
import buildJob from 'jobs/build'
import { getInstallationOctokit } from 'modules/github/client'
import { validateConfig } from 'modules/config'
import { notifyBuildGitHubStatus } from 'modules/build'

const router = new Router()

const getTokenRepository = asyncHandler(async function checkToken(
  req,
  res,
  next,
) {
  if (!req.body.token) {
    throw new HttpError(400, 'token is required')
  }

  const repository = await Repository.query()
    .where({ token: req.body.token })
    .first()

  if (!repository) {
    throw new HttpError(400, 'token is not linked to a repository')
  }

  req.repository = repository
  next()
})

const assertBodyValue = (...values) => (req, res, next) => {
  for (const value of values) {
    if (!req.body[value]) {
      throw new HttpError(400, 'bundler is required')
    }
  }

  next()
}

router.post(
  '/bundles',
  bodyParser.json(),
  getTokenRepository,
  assertBodyValue('bundler', 'stats'),
  asyncHandler(async (req, res) => {
    const bundle = await Bundle.query().insertAndFetch({
      repositoryId: req.repository.id,
      bundler: req.body.bundler,
      stats: req.body.stats,
    })

    res.send({
      id: bundle.id,
      webpackStatsPutUrl: bundle.getWebpackStatsPutUrl(),
    })
  }),
)

router.post(
  '/builds',
  bodyParser.json(),
  getTokenRepository,
  assertBodyValue('commit', 'branch', 'providerMetadata', 'bundleId'),
  asyncHandler(async (req, res) => {
    const buildConfig = req.body.config || req.repository.config

    const configValidation = validateConfig(buildConfig)

    if (!configValidation.valid) {
      res.status(400)
      res.send({
        error: { message: 'Invalid config', errors: configValidation.errors },
      })
      return
    }

    const bundle = await Bundle.query().findById(req.body.bundleId)
    if (!bundle) {
      throw new HttpError(400, 'Bundle not found')
    }

    const [installation] = await req.repository.$relatedQuery('installations')
    if (!installation) {
      throw new HttpError(400, `Installation not found for repository`)
    }

    const octokit = getInstallationOctokit(installation)

    const owner = await req.repository.$relatedOwner()

    let commitInfo
    try {
      ;({ data: commitInfo } = await octokit.repos.getCommit({
        owner: owner.login,
        repo: req.repository.name,
        ref: req.body.commit,
      }))
    } catch (error) {
      const httpError = new HttpError(400, 'commit not found on GitHub')
      httpError.code = 'unknown-commit'
      throw httpError
    }

    if (!req.repository.active) {
      await req.repository.$query().patch({ active: true })
    }

    const build = await Build.query().insertAndFetch({
      jobStatus: 'queued',
      bundleId: bundle.id,
      repositoryId: req.repository.id,
      branch: req.body.branch,
      commit: req.body.commit,
      stats: req.body.stats,
      config: buildConfig,
      providerMetadata: req.body.providerMetadata,
      commitInfo: {
        sha: commitInfo.sha,
        message: commitInfo.commit.message,
        author: {
          id: commitInfo.author.id,
          name: commitInfo.commit.author.name,
          login: commitInfo.author.login,
          avatarUrl: commitInfo.author.avatar_url,
        },
      },
    })

    await notifyBuildGitHubStatus(build, 'pending')
    await buildJob.push(build.id)

    res.send(build)
  }),
)

export default router
