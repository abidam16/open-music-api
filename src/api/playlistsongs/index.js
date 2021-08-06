const SongPlaylistHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'playlistsongs',
  version: '1.0.0',
  register: async (server, { songPlaylistService, playlistsService, validator }) => {
    const songPlaylistHandler = new SongPlaylistHandler(songPlaylistService, playlistsService, validator)
    server.route(routes(songPlaylistHandler))
  }
}
