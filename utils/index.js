const modelUtils = schema => {
  const validator = schema.reduce((acc, { key, type, optional = false, regexp = null }) => {
    acc[key] = (value) => {
      if (!value && !optional) throw new Error(
        `${key} is required`
      )
      if (value && typeof value !== type) throw new TypeError(
        `Expected ${key} to be ${type} but got ${typeof value}`
      )
      if (value && regexp && !value.match(regexp)) throw new Error(
        `${value} does not match the regular expression ${regexp} expected for ${key}`
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

module.exports = {
  modelUtils,
  modelStatics
}

