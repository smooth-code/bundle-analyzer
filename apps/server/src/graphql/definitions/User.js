import gql from 'graphql-tag'

export const typeDefs = gql`
  type User {
    id: ID!
    login: String!
    name: String
  }

  extend type Query {
    "Get the authenticated user"
    user: User
  }
`

export const resolvers = {
  Query: {
    async user(rootObj, args, context) {
      return context.user || null
    },
  },
}
