const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const mapDBToModel = require('../../utils')
const NotFoundError = require('../../exceptions/NotFoundError')

class MusicsService {
  constructor () {
    this._pool = new Pool()
  }

  async addMusic ({ title, year, performer, genre, duration }) {
    const id = 'song-' + nanoid(16)
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

    const query = {
      text: 'INSERT INTO musics VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [id, title, year, performer, genre, duration, insertedAt, updatedAt]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Musik gagal ditemukan')
    }

    return result.rows[0].id
  }

  async getMusics () {
    const result = await this._pool.query('SELECT id, title, performer FROM musics')

    return result.rows.map(mapDBToModel)
  }

  async getMusicById (songId) {
    const query = {
      text: 'SELECT * FROM musics WHERE id = $1',
      values: [songId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Musik tidak ditemukan')
    }

    return result.rows.map(mapDBToModel)[0]
  }

  async editMusicById (songId, { title, year, performer, genre, duration }) {
    const insertedAt = new Date().toISOString()

    const query = {
      text: 'UPDATE musics SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, inserted_at = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, insertedAt, songId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui musik. Id tidak ditemukan')
    }
  }

  async deleteMusicById (songId) {
    const query = {
      text: 'DELETE FROM musics WHERE id = $1 RETURNING id',
      values: [songId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus musik. Id tidak ditemukan')
    }
  }
}

module.exports = MusicsService
