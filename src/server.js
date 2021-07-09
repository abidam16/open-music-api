require('dotenv').config()

const Hapi = require('@hapi/hapi')
const MusicsService = require('./services/postgres/MusicsService')
const MusicsValidator = require('./validator/musics')
const musics = require('./api/musics')

const init = async () => {
  const musicService = new MusicsService()
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register({
    plugin: musics,
    options: {
      service: musicService,
      validator: MusicsValidator
    }
  })

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
