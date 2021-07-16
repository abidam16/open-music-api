const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class SongPlaylistService {
  constructor (playlistsService) {
    this._pool = new Pool()
    this._playlistsService = playlistsService
  }

  async addSongPlaylist (playlistId, owner, songId) {
    await this._playlistsService.verifyPlaylistOwner(playlistId, owner)
    const id = nanoid(16)
    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan lagu')
    }

    return result.rows[0].id
  }

  async getSongsPlaylist (playlistId, owner) {
    await this._playlistsService.verifyPlaylistOwner(playlistId, owner)
    console.log(playlistId)
    const query = {
      text: `SELECT s.id, s.title, s.performer
        FROM playlistsongs as p INNER JOIN songs as s ON p.song_id = s.id
        WHERE p.playlist_id = $1`,
      values: [playlistId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }

    return result.rows
  }

  async deleteSongPlaylist (playlistId, songId, owner) {
    await this._playlistsService.verifyPlaylistOwner(playlistId, owner)
    await this.verifySongId(songId)
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu')
    }
  }

  async verifySongId (songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Id tidak ditemukan')
    }
  }
}

module.exports = SongPlaylistService
