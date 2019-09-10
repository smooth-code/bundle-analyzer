import gql from 'graphql-tag'

export const typeDefs = gql`
  enum JobStatus {
    pending
    progress
    complete
    error
  }

  type Synchronization {
    id: ID!
    jobStatus: JobStatus!
  }
`
