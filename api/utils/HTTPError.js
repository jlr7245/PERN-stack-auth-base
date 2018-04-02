class HTTPError extends Error {
  constructor(status, message, ...params) {
    super(message, params)
    this.status = status
  }
}

module.exports = HTTPError
