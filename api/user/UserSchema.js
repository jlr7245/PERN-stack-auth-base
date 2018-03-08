module.exports = [
  {
    key: 'id',
    type: 'number',
    optional: true
  }, {
    key: 'username',
    type: 'string'
  }, {
    key: 'password_digest',
    type: 'string'
  }, {
    key: 'email',
    type: 'string',
    regexp: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  }
]
