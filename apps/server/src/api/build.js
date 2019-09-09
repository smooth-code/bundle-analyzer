import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { HttpError } from 'express-err'
import bodyParser from 'body-parser'
import { Build, Repository } from '../models'
import buildJob from '../jobs/build'

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

    const build = await Build.query().insertAndFetch({
      jobStatus: 'pending',
      repositoryId: req.repository.id,
      branch: req.body.branch,
      commit: req.body.commit,
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

    build = await build.$query()
    await buildJob.push(build.id)

    res.send(build)
  }),
)

export default router
