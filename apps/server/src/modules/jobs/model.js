import { createJob } from './job'

export function createModelJob(
  queue,
  Model,
  { push, perform, error, complete },
) {
  return createJob(queue, {
    async push(id) {
      if (push) {
        const model = await Model.query().findById(id)
        await push(model)
      }
    },
    async perform(id) {
      const model = await Model.query().findById(id)

      if (!model) {
        throw new Error(`${Model.name} not found`)
      }

      await model.$query().patch({ jobStatus: 'progress' })
      await perform(model)
    },
    async error(id) {
      await Model.query()
        .patch({ jobStatus: 'error' })
        .where({ id })
      if (error) {
        const model = await Model.query().findById(id)
        await error(model)
      }
    },
    async complete(id) {
      await Model.query()
        .patch({ jobStatus: 'complete' })
        .where({ id })
      if (complete) {
        const model = await Model.query().findById(id)
        await complete(model)
      }
    },
  })
}

export const modelSchema = {
  required: ['jobStatus'],
  properties: {
    jobStatus: {
      type: 'string',
      enum: ['queued', 'progress', 'complete', 'error'],
    },
  },
}
