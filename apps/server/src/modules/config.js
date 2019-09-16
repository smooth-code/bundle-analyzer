import bytes from 'bytes'
import Ajv from 'ajv'

const ajv = new Ajv()
const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://example.com/product.schema.json',
  title: 'Size Check Config',
  description: 'The configuration of size checks',
  type: 'object',
  required: ['files'],
  additionalProperties: false,
  properties: {
    files: {
      description: 'The file rules',
      type: 'array',
      items: {
        type: 'object',
        required: ['test', 'maxSize'],
        additionalProperties: false,
        properties: {
          test: {
            description: 'Glob expression',
            type: 'string',
          },
          maxSize: {
            description: 'Max size',
            type: 'string',
          },
          compression: {
            description: 'Compression',
            type: 'string',
          },
        },
      },
    },
  },
}

export function validateConfig(config) {
  const validate = ajv.compile(schema)
  const validSchema = validate(config)
  if (!validSchema) return { valid: false, errors: validate.errors }
  const invalidSizeErrors = config.files.reduce((errors, fileRule, index) => {
    if (!Number.isInteger(bytes(fileRule.maxSize))) {
      return [
        ...errors,
        {
          keyword: 'invalidSize',
          dataPath: `.files[${index}]`,
          params: { value: fileRule.maxSize },
          message: `invalid size, please specify unit in bytes, ex: "1 kB"`,
        },
      ]
    }
    return errors
  }, [])
  return {
    valid: invalidSizeErrors.length === 0,
    errors: invalidSizeErrors,
  }
}
