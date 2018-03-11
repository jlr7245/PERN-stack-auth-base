const bcrypt = require('bcryptjs')

const modelUtils = schema => {
  const validator = schema.reduce((acc, {
    key,
    type,
    optional = false,
    regexp = null,
    regexpMessage = null,
    otherCondition = null,
    otherConditionMessage = null
  }) => {
    acc[key] = (value) => {
      if (!value && !optional) throw new Error(
        `${key} is required`
      )
      if (value && typeof value !== type) throw new TypeError(
        `Expected ${key} to be ${type} but got ${typeof value}`
      )
      if (value && regexp && !value.match(regexp)) throw new Error(
        `${value} not valid for ${key}. ${regexpMessage}`
      )
      if (value && otherCondition && !otherCondition(val)) throw new Error(
        `${value} not valid for ${key}. ${otherConditionMessage}`
      ) 
      return value
    }
    return acc
  }, {})

  return {
    _modify: function(changes) {
      return Object.assign(this, changes)
    },
    _validate: (val, key) => {
      if (validator.hasOwnProperty(key)) return validator[key](val)
      throw new Error(`Property ${key} not found in validator`)
    }
  }
}

const modelStatics = (db, tablename) => ({
  findAll: () => db.query(`SELECT * FROM ${tablename}`),
  findOne: id => db.oneOrNone(`SELECT * FROM ${tablename} WHERE id = $1`, id),
  destroy: id => db.none(`DELETE FROM ${tablename} WHERE id = $1`, id)
})

const comparePass = (userPassword, databasePassword) => (
  bcrypt.compareSync(userPassword, databasePassword)
)

module.exports = {
  modelUtils,
  modelStatics,
  comparePass
}

