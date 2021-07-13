const ClientError = require('./ClientError')

class authenticationError extends ClientError {
  constructor (message) {
    super(message, 401)
    this.name = 'AuthenticationError'
  }
}

module.exports = authenticationError
