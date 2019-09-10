import '../init'
import { runBuild } from './build'
import { Build } from '../models'

xdescribe('#runBuild', () => {
  it('should run the build', async () => {
    const build = await Build.query().findById(
      '971174ce-16ee-4ebb-871e-8d375db4fab5',
    )
    await runBuild(build)
  })
})
