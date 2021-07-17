/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql("INSERT INTO users(id, username, password, fullname) VALUES ('old_notes', 'old_notes', 'old_notes', 'old_notes')")

  pgm.sql("UPDATE playlists SET owner = 'old_notes' WHERE owner = NULL")

  pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE')

  pgm.addConstraint('playlistsongs', 'fk_playlistsongs.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE')

  pgm.addConstraint('playlistsongs', 'fk_playlistsongs.song_id_songs.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE')
}

exports.down = pgm => {
  pgm.dropConstraint('playlistsongs', 'fk_playlistsongs.song_id_songs.id')

  pgm.dropConstraint('playlistsongs', 'fk_playlistsongs.playlist_id_playlists.id')

  pgm.dropConstraint('playlists', 'fk_playlists.owner_users.id')

  pgm.sql("UPDATE playlists SET owner = NULL WHERE owner = 'old_notes'")

  pgm.sql("DELETE FROM users WHERE id = 'old_notes'")
}
