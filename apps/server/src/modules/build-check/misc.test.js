import 'modules/test-util/database/setup'
import { factory } from 'modules/test-util'
import { loadBuildCheckDependencies } from './misc'

describe('#loadBuildCheckDependencies', () => {
  it('loads repository, owner & installations', async () => {
    const buildCheck = await factory.create('buildCheck')
    await loadBuildCheckDependencies(buildCheck)
    expect(buildCheck.build).toBeDefined()
    expect(buildCheck.build.repository).toBeDefined()
    expect(buildCheck.build.repository.installations).toBeDefined()
    expect(buildCheck.build.repository.owner).toBeDefined()
  })
})
