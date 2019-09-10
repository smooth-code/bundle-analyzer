import { BaseModel, mergeSchemas } from './util'

export class InstallationRepositoryRight extends BaseModel {
  static tableName = 'installation_repository_rights'

  static jsonSchema = mergeSchemas(BaseModel.jsonSchema, {
    required: ['installationId', 'repositoryId'],
    properties: {
      installationId: { type: 'string' },
      repositoryId: { type: 'string' },
    },
  })

  static relationMappings = {
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'Installation',
      join: {
        from: 'installation_repository_rights.installationId',
        to: 'installations.id',
      },
    },
    repository: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'Repository',
      join: {
        from: 'installation_repository_rights.repositoryId',
        to: 'repositories.id',
      },
    },
  }
}
