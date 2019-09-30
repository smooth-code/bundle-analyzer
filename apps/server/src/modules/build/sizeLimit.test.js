import 'modules/test-util/database/setup'
import { factory } from 'modules/test-util'
import { getSizeLimitReport } from './sizeLimit'

describe('#getSizeLimitReport', () => {
  describe('without any asset & check', () => {
    it('returns a neutral size report', async () => {
      const build = await factory.create('build')
      const report = await getSizeLimitReport(build)
      expect(report).toEqual({ checks: [], conclusion: 'neutral' })
    })
  })
})
