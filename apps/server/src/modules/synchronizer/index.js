import { GitHubSynchronizer } from './github'

export async function synchronize(synchronization) {
  const synchronizer = new GitHubSynchronizer(synchronization)
  await synchronizer.synchronize(synchronization)
}
