const shouldBeLoggedIn = (req, res, next) => (
  !req.user
    ? next(new Error('Authorization required'))
    : next()
)

const shouldBeLoggedOut = (req, res, next) => (
  req.user
    ? next(new Error('Already logged in'))
    : next()
)

module.exports = {
  shouldBeLoggedIn,
  shouldBeLoggedOut
}
