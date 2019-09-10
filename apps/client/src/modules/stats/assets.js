export function getTotalAssetsSize(stats) {
  return stats.assets.reduce((sum, asset) => sum + asset.size, 0)
}

export function getTotalAssetsNumber(stats) {
  return stats.assets.length
}
