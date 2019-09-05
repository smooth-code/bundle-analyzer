import React from 'react'

const RepositoryContext = React.createContext()

export function RepositoryProvider({ repository, children }) {
  return (
    <RepositoryContext.Provider value={repository}>
      {children}
    </RepositoryContext.Provider>
  )
}

export function useRepository() {
  return React.useContext(RepositoryContext)
}
