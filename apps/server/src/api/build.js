import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { HttpError } from 'express-err'
import bodyParser from 'body-parser'
import { Build, Repository } from '../models'
import buildJob from '../jobs/build'
import { getInstallationOctokit } from '../modules/github/client'

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

router.post(
  '/builds',
  bodyParser.json(),
  getTokenRepository,
  asyncHandler(async (req, res) => {
    if (!req.body.branch) {
      throw new HttpError(400, 'branch is required')
    }

    if (!req.body.commit) {
      throw new HttpError(400, 'commit is required')
    }

    const [installation] = await req.repository.$relatedQuery('installations')
    if (!installation) {
      throw new HttpError(400, `Installation not found for repository`)
    }

    const owner = await req.repository.$relatedOwner()

    const octokit = getInstallationOctokit(installation)

    let data
    try {
      ;({ data } = await octokit.repos.getCommit({
        owner: owner.login,
        repo: req.repository.name,
        ref: req.body.commit,
      }))
    } catch (error) {
      const httpError = new HttpError(400, 'commit not found on GitHub')
      httpError.code = 'unknown-commit'
      throw httpError
    }

    const build = await Build.query().insertAndFetch({
      jobStatus: 'pending',
      repositoryId: req.repository.id,
      branch: req.body.branch,
      commit: req.body.commit,
      stats: req.body.stats,
      sizeCheckConfig: req.repository.sizeCheckConfig,
      providerMetadata: req.body.providerMetadata,
      commitInfo: {
        sha: data.sha,
        message: data.commit.message,
        author: {
          id: data.author.id,
          name: data.commit.author.name,
          login: data.author.login,
          avatarUrl: data.author.avatar_url,
        },
      },
    })

    res.send({
      ...build,
      webpackStatsPutUrl: Build.getWebpackStatsPutUrl(build.id),
    })
  }),
)

router.post(
  '/builds/:id/start',
  bodyParser.json(),
  getTokenRepository,
  asyncHandler(async (req, res) => {
    let build = await Build.query().findById(req.params.id)
    if (!build) {
      throw new HttpError(400, 'bundle-info not found')
    }

    if (build.jobStatus !== 'pending') {
      throw new HttpError(400, 'build already started')
    }

    if (!req.repository.active) {
      await req.repository.$query().patch({ active: true })
    }

    const owner = await req.repository.$relatedOwner()

    const [installation] = await req.repository.$relatedQuery('installations')
    if (!installation) {
      throw new HttpError(400, `Installation not found for repository`)
    }

    const octokit = getInstallationOctokit(installation)
    const { data: checkRun } = await octokit.checks.create({
      owner: owner.login,
      repo: req.repository.name,
      name: 'bundle-analyzer',
      head_sha: build.commit,
      external_id: build.id,
      status: 'queued',
      details_url: `http://localhost:8080/gh/${owner.login}/${req.repository.name}/builds/${build.number}`,
    })

    build = await build
      .$query()
      .patchAndFetch({ githubCheckRunId: checkRun.id })

    await buildJob.push(build.id)

    res.send(build)
  }),
)

export default router
