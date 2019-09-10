import React from 'react'
import axios from 'axios'

export function StatsLoader({ url, fallback = null, children }) {
  const [loading, setLoading] = React.useState(true)
  const [stats, setStats] = React.useState(null)
  React.useEffect(() => {
    setLoading(true)
    axios.get(url).then(response => {
      setStats(response.data)
      setLoading(false)
    })
  }, [url])

  if (loading) return fallback
  if (!stats) return null
  return children(stats)
}
