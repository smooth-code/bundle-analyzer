import { loadBuildDependencies } from 'modules/build'

export async function loadBuildCheckDependencies(buildCheck) {
  await buildCheck.$loadRelated('build')
  const { build } = buildCheck
  await loadBuildDependencies(build)
}
