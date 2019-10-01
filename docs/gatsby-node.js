module.exports.createPages = ({ actions }) => {
  actions.createRedirect({
    fromPath: `/docs/`,
    toPath: `/docs/quick-start/`,
    redirectInBrowser: true,
  })

  actions.createRedirect({
    fromPath: `/app/`,
    toPath: `https://app.bundle-analyzer.com`,
    redirectInBrowser: true,
  })
}
