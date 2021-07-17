const InvariantError = require('../../exceptions/InvariantError')
const { CollaborationPayloadSchema } = require('./schema')

const CollaborationsValidator = {
  validateCollaborationPayload: (payload) => {
    const validationsResult = CollaborationPayloadSchema.validate(payload)

    if (validationsResult.error) {
      throw new InvariantError(validationsResult.error.message)
    }
  }
}

module.exports = CollaborationsValidator
