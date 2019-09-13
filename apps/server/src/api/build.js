/* eslint-disable no-restricted-syntax */
import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { HttpError } from 'express-err'
import bodyParser from 'body-parser'
import { Build, Bundle, Repository } from '../models'
import buildJob from '../jobs/build'
import { getInstallationOctokit } from '../modules/github/client'
import config from '../config'

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
    const bundle = await Bundle.query().findById(req.body.bundleId)
    if (!bundle) {
      throw new HttpError(400, 'bundle not found')
    }

    const [installation] = await req.repository.$relatedQuery('installations')
    if (!installation) {
      throw new HttpError(400, `Installation not found for repository`)
    }

    const owner = await req.repository.$relatedOwner()

    const octokit = getInstallationOctokit(installation)

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
      sizeCheckConfig: req.repository.sizeCheckConfig,
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

    const { data: checkRun } = await octokit.checks.create({
      owner: owner.login,
      repo: req.repository.name,
      name: 'bundle-analyzer',
      head_sha: build.commit,
      external_id: build.id,
      status: 'queued',
      details_url: `${config.get('appBaseUrl')}/gh/${owner.login}/${
        req.repository.name
      }/builds/${build.number}`,
    })

    await build.$query().patch({ githubCheckRunId: checkRun.id })
    await buildJob.push(build.id)

    res.send(build)
  }),
)

export default router
