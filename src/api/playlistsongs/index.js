const SongPlaylistHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'playlistsongs',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const songPlaylistHandler = new SongPlaylistHandler(service, validator)
    server.route(routes(songPlaylistHandler))
  }
}
