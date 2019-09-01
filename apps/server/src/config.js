import path from 'path'
import convict from 'convict'

const config = convict({
  env: {
    doc: 'The application environment',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  server: {
    port: {
      doc: 'The server port number',
      format: 'port',
      default: 3000,
      env: 'PORT',
    },
    logFormat: {
      doc: 'The morgan log format to use',
      format: ['dev', 'combined', 'common', 'short', 'tiny', ''],
      default: 'dev',
    },
    secure: {
      doc: 'Specify if the server is using https or not.',
      format: Boolean,
      default: false,
    },
  },
  pg: {
    client: {
      doc: 'Knex client',
      format: String,
      default: 'postgresql',
    },
    connection: {
      host: {
        doc: 'Postgres user',
        format: String,
        default: 'localhost',
      },
      user: {
        doc: 'Postgres user',
        format: String,
        default: 'postgres',
      },
      database: {
        doc: 'Postgres database',
        format: String,
        default: 'development',
      },
    },
  },
  amqp: {
    url: {
      doc: 'RabbitMQ url',
      format: String,
      default: 'amqp://localhost',
      env: 'CLOUDAMQP_URL',
    },
  },
  github: {
    appId: {
      doc: 'App ID',
      format: String,
      default: '',
      env: 'GITHUB_APP_ID',
    },
    privateKey: {
      doc: 'Private key',
      format: String,
      default: '',
      env: 'GITHUB_APP_PRIVATE_KEY',
    },
    clientId: {
      doc: 'Client ID',
      format: String,
      default: '',
      env: 'GITHUB_CLIENT_ID',
    },
    clientSecret: {
      doc: 'Client Secret',
      format: String,
      default: '',
      env: 'GITHUB_CLIENT_SECRET',
    },
  },
})

const env = config.get('env')
config.loadFile(path.join(__dirname, `../config/${env}.json`))
config.validate()

export default config
