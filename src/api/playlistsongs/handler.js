const ClientError = require('../../exceptions/ClientError')

class PlaylistSongsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this)
    this.getPlaylistsSongHandler = this.getPlaylistsSongHandler.bind(this)
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this)
  }

  async postPlaylistSongHandler (request, h) {
    try {
      this._validator.validateSongPlaylistPayload(request.payload)
      const { id: credentialId } = request.auth.credentials
      const { songId } = request.payload
      const { playlistId } = request.params

      await this._service.addSongPlaylist(playlistId, credentialId, songId)

      const response = h.response({
        status: 'success',
        message: 'Berhasil menambah lagu'
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
      const response = h.response({
        status: 'error',
        message: 'Maaf terjadi kegagalan pada server kami'
      })
      response.code(500)
      console.log(error)
      return response
    }
  }

  async getPlaylistsSongHandler (request, h) {
    try {
      const { playlistId } = request.params
      const { id: credentialId } = request.auth.credentials

      const songs = await this._service.getSongsPlaylist(playlistId, credentialId)

      return {
        status: 'success',
        data: {
          songs
        }
      }
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
        status: 'fail',
        message: 'Maaf, terjadi kegagalan pada server kami'
      })
      response.code(500)
      console.log(error)
      return response
    }
  }

  async deletePlaylistSongHandler (request, h) {
    try {
      await this._validator.validateSongPlaylistPayload(request.payload)
      const { songId } = request.payload
      const { playlistId } = request.params
      const { id: credentialId } = request.auth.credentials
      await this._service.deleteSongPlaylist(playlistId, songId, credentialId)

      return {
        status: 'success',
        message: 'Berhasil menghapus lagu'
      }
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
}

module.exports = PlaylistSongsHandler
