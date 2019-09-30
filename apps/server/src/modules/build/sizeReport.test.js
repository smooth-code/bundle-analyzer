import 'modules/test-util/database/setup'
import { factory } from 'modules/test-util'
import { getSizeReport } from './sizeReport'

describe('#getSizeReport', () => {
  describe('without any asset & check', () => {
    it('returns a neutral size report', async () => {
      const build = await factory.create('build')
      const sizeReport = await getSizeReport(build)
      expect(sizeReport).toEqual({ checks: [], conclusion: 'neutral' })
    })
  })
})
