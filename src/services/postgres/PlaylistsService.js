const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const AuthorizationError = require('../../exceptions/AuthorizationError')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class PlaylistsService {
  constructor () {
    this._pool = new Pool()
  }

  async addPlaylist ({ name, owner }) {
    const id = `playlist-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan playlist')
    }

    return result.rows[0].id
  }

  async getPlaylists (owner) {
    const query = {
      text: `SELECT p.id, p.name, u.username 
        FROM playlists as p INNER JOIN users as u ON u.id = p.owner 
        WHERE p.owner = $1`,
      values: [owner]
    }

    const result = await this._pool.query(query)

    return result.rows
  }

  async deletePlaylist (id, owner) {
    await this.verifyPlaylistOwner(id, owner)
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id]
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }
  }

  async verifyPlaylistOwner (id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }

    const note = result.rows[0]

    if (note.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
    }
  }
}

module.exports = PlaylistsService
