const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const init = require('./passport')
const User = require('../../user/User')
const { comparePass } = require('..')

const options = {};

init()

passport.use(
  new LocalStrategy(options, (username, password, done) => {
    User.findByUserName(username)
      .then(user => {
        if (!user) {
          return done(null, false)
        }
        if (!comparePass(password, user.password_digest)) {
          return done(null, false)
        } else {
          return done(null, user)
        }
      }).catch(err => {
        console.log(err)
        return done(err)
      })
  })
)

module.exports = passport
