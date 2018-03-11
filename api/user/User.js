const db = require('../../db/config')
const { modelUtils, modelStatics } = require('../utils')
const schema = require('./UserSchema')

function User({ id = null, username, password_digest, email }) {
  this.id = this._validate(id, 'id')
  this.username = this._validate(username, 'username')
  this.password_digest = this._validate(password_digest, 'password_digest')
  this.email = this._validate(email, 'email')
}

const userStatics = modelStatics(db, 'users')
userStatics.findByUserName = (username) => {
  return db.one(`
    SELECT * FROM users
    WHERE username = $1
    ORDER BY id ASC
  `, username)
}
Object.setPrototypeOf(User, userStatics)
User.prototype = Object.assign(User.prototype, modelUtils(schema))

User.prototype.save = function() {
  return db.one(`
    INSERT INTO users (
      username, email, password_digest
    ) VALUES (
      $/username/, $/email/, $/password_digest/
    )
    RETURNING *
  `, this)
  .then(user => this._modify(user))
}

module.exports = User
