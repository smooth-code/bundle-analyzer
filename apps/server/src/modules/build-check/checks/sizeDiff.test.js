import 'modules/test-util/database/setup'
import { factory } from 'modules/test-util'
import { getCheckResult } from './sizeDiff'

describe('#getCheckResult', () => {
  describe('with baseline branch', () => {
    it('returns a neutral check result', async () => {
      const buildCheck = await factory.create('buildCheck')
      const checkResult = await getCheckResult(buildCheck)
      expect(checkResult).toEqual({
        conclusion: 'neutral',
        output: {
          title: 'Baseline branch build',
          summary: 'This build serves as reference, nothing to compare.',
        },
      })
    })
  })
})
