const ClientError = require('../../exceptions/ClientError')

class PlaylistsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this)
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this)
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this)
  }

  async postPlaylistHandler (request, h) {
    try {
      this._validator.validatePlaylistPayload(request.payload)
      const { name } = request.payload
      const { id: credentialId } = request.auth.credentials

      const playlistId = await this._service.addPlaylist({
        name,
        owner: credentialId
      })
      const response = h.response({
        status: 'success',
        message: 'Playlist Berhasil di tambahkan',
        data: {
          playlistId: playlistId
        }
      })
      response.code(201)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      // SERVER ERROR
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami'
      })
      response.code(500)
      console.log(error)
      return response
    }
  }

  async getPlaylistsHandler (request, h) {
    try {
      const { id: credentialId } = request.auth.credentials
      const playlists = await this._service.getPlaylists(credentialId)
      const response = h.response({
        status: 'success',
        data: {
          playlists
        }
      })
      response.code(200)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami'
      })
      response.code(500)
      console.log(error)
      return response
    }
  }

  async deletePlaylistHandler (request, h) {
    try {
      const { playlistId } = request.params
      const { id: credentialId } = request.auth.credentials
      await this._service.deletePlaylist(playlistId, credentialId)
      const response = h.response({
        status: 'success',
        message: 'Berhasil menghapus playlist'
      })
      response.code(200)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami'
      })
      response.code(500)
      return response
    }
  }
}

module.exports = PlaylistsHandler
