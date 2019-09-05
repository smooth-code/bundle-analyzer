import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { HttpError } from 'express-err'
import bodyParser from 'body-parser'
import { BundleInfo, Repository } from '../models'

const router = new Router()

router.post(
  '/bundle-infos',
  bodyParser.json(),
  asyncHandler(async (req, res) => {
    if (!req.body.token) {
      throw new HttpError(400, 'token is required')
    }

    if (!req.body.branch) {
      throw new HttpError(400, 'branch is required')
    }

    if (!req.body.commit) {
      throw new HttpError(400, 'commit is required')
    }

    const repository = await Repository.query()
      .where({ token: req.body.token })
      .first()

    if (!repository) {
      throw new HttpError(400, 'token is not linked to a repository')
    }

    const bundleInfo = await BundleInfo.query().insertAndFetch({
      repositoryId: repository.id,
      branch: req.body.branch,
      commit: req.body.commit,
    })

    res.send(BundleInfo.getWebpackStatsPutUrl(bundleInfo.id))
  }),
)

export default router
