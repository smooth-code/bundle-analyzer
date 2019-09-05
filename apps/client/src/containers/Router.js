import React from 'react'
import { __RouterContext } from 'react-router-dom'

export function useRouter() {
  return React.useContext(__RouterContext)
}
