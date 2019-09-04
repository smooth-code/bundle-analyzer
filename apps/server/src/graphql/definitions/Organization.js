import gql from 'graphql-tag'

export const typeDefs = gql`
  type Organization {
    id: ID!
    name: String
  }
`
