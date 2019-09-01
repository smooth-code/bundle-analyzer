import React from 'react'
import { Button } from '@smooth-ui/core-sc'
import { useAuthToken } from './AuthContext'

export function Home() {
  const token = useAuthToken()
  console.log(token)
  return (
    <Button
      as="a"
      href={`https://github.com/login/oauth/authorize?scope=user:email&client_id=${process.env.GITHUB_CLIENT_ID}`}
    >
      Login GitHub
    </Button>
  )
}
