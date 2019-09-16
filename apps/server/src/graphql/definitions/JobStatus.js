import gql from 'graphql-tag'

export const typeDefs = gql`
  enum JobStatus {
    pending
    queued
    progress
    complete
    error
  }
`
