import 'modules/test-util/database/setup'
import { factory } from 'modules/test-util'
import { getCheckResult } from './sizeLimit'

describe('#getCheckResult', () => {
  describe('without any asset & check', () => {
    it('returns a neutral check result', async () => {
      const buildCheck = await factory.create('buildCheck')
      const checkResult = await getCheckResult(buildCheck)
      expect(checkResult).toEqual({
        conclusion: 'neutral',
        output: {
          title: 'No size check',
          summary:
            'There is no size check configured on the project. See [documentation to learn how to configure size checks](https://docs.bundle-analyzer.com).',
        },
      })
    })
  })
})
