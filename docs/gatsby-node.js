module.exports.createPages = ({ actions }) => {
  actions.createRedirect({
    fromPath: `/docs/`,
    toPath: `/docs/quick-start/`,
    redirectInBrowser: true,
  })
}
