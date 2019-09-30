import { execute } from 'graphql/execution'
import { schema } from '../../graphql/schema'

export async function execGraphql(
  query,
  { variables = {}, context = {} } = {},
) {
  const { data, errors } = await execute(
    schema,
    query,
    null,
    context,
    variables,
  )
  if (errors && errors.length) {
    const error = new Error(errors)
    error.graphqlErrors = errors
    throw error
  }
  return data
}
