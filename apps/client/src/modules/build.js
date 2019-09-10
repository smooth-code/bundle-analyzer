export function getBuildStatus(build) {
  if (build.jobStatus === 'complete') {
    return build.conclusion === 'success' ? 'success' : 'failure'
  }
  return 'pending'
}

export function getStatusColor(status) {
  switch (status) {
    case 'success':
      return 'success'
    case 'failure':
      return 'danger'
    case 'pending':
    default:
      return 'warning'
  }
}
