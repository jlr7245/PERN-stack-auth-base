const db = require('../../db/config')
const TodoSchema = require('./TodoSchema')
const { modelUtils, modelStatics } = require('../utils')

function Todo({ id = null, title, description, category }) {
  this.id = this._validate(id, 'id')
  this.title = this._validate(title, 'title')
  this.description = this._validate(description, 'description')
  this.category = this._validate(category, 'category')
}

Todo.prototype = Object.assign(Todo.prototype, modelUtils(TodoSchema))

const todoStatics = modelStatics(db, 'todos')
todoStatics.findByCategory = (category) => (
  db.manyOrNone(`SELECT * FROM todos WHERE category = $1`, category)
)
Object.setPrototypeOf(Todo, todoStatics)

Todo.prototype.save = function() {
  return db.one(`
    INSERT INTO todos
    (title, description, category)
    VALUES $/title/, $/description/, $/category/
    RETURNING *
  `, this)
    .then(todo => this._modify(todo))
    .catch(err => err)
}

Todo.prototype.update = function(changes) {
  this = this._modify(changes)
  return db.one(`
    UPDATE todos SET
    title = $/title/,
    description = $/description,
    category = $/category
    WHERE id = $/id/
    RETURNING *
  `, this)
}
