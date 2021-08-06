const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class SongPlaylistService {
  constructor (cacheService) {
    this._pool = new Pool()
    this._cacheService = cacheService
  }

  async addSongPlaylist (playlistId, owner, songId) {
    const id = nanoid(16)
    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan lagu')
    }

    await this._cacheService.delete(`playlist:${owner}`)
    return result.rows[0].id
  }

  async getSongsPlaylist (playlistId, owner) {
    try {
      const result = await this._cacheService.get(`playlist:${owner}`)
      return JSON.parse(result)
    } catch (error) {
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

      await this._cacheService.set(`playlist:${owner}`, JSON.stringify(result))
      return result.rows
    }
  }

  async deleteSongPlaylist (playlistId, songId) {
    await this.verifySongId(songId)
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu')
    }

    const { owner } = result.rows[0]
    await this._cacheService.delete(`playlist:${owner}`)
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
