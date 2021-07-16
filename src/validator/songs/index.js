const InvariantError = require('../../exceptions/InvariantError')
const { SongPayloadSchema, SongPlaylistPayloadSchema } = require('./schema')

const SongsValidator = {
  validateSongsPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },

  validateSongPlaylistPayload: (payload) => {
    const validationResult = SongPlaylistPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = SongsValidator
