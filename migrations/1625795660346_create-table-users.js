/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    username: {
      type: 'VARCHAR(50)',
      noteNull: true
    },
    password: {
      type: 'TEXT',
      noteNull: true
    },
    fullname: {
      type: 'TEXT',
      noteNull: true
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('users')
}
