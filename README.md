![pern-stack](https://user-images.githubusercontent.com/12768542/37250285-15cb7da8-24c7-11e8-97a5-33d613f3865b.jpg)

# PERN Stack Base

This app is a boilerplate for a Postgres/Express/React/Node app with basic authentication built in, using Passport and sessions.

### Libraries Used

- [pg-promise](https://github.com/vitaly-t/pg-promise) for database connection
- Redux for state management
- Passport, express-sessions, bcrypt for authentication
- Create React App for bootstrapping the React app

### File Structure

Here is a high-level overview of our file structure.

```bash
.
├── README.md
├── api/ # routes, models, controllers, middleware, and utilities for express 
├── client/ # all things React
├── db/ # database setup and migrations
├── public/ # will contain the production-ready React app
└── server.js 
```

# Table of Contents

- [Setup Instructions](#setup-instructions)
    - [Requirements](#requrements)
    - [Environmental Variables](#environmental-variables)
    - [Installation & Setup](#installation-setup)
    - [Deployment](#deployment)
- [Server](#server)
    - [Structure](#structure)
    - [Adding New Models](#adding-new-models)
    - [Routes & Controllers](#routes-controllers)
    - [`send`](#send)
- [Client](#client)
- [Acknowledgements & Licensing Details](#acknowledgements-licensing-details)

# Setup Instructions

To get started, simply clone this repository and follow the below instructions. (If you'd like to get rid of the reference back to this git repository, run the command `rm -rf .git`.)

### Requirements

- Node 8 or later, along with yarn or npm.
- PostgreSQL

### Environmental Variables

This app is looking for a file `.env` at the root of the repository, on the same level as `package.json`. You'll need to create that file and add three values:

```
SECRET_KEY=[string of gibberish]
PORT=3001
LOCAL_DATABASE_NAME=[name of your local database]
```

The secret key is used in the passport setup, and the local database name is used for the pg-promise setup.

The port number does not need to be 3001. **However**, if you need to change the port for any reason, you **must** also make a change to the `package.json` in the `client` directory. There is a field `"proxy": "http://localhost:3001"` -- the port here must match the port the Express app is running on. 

### Installation & Setup

- Run `npm install` or `yarn install` in both the root directory and in `client`.
- Create a PostgreSQL database using the `createdb` command.
- Create the `.env` file as mentioned above.
- Run the migration file in `db/migrations` using the command `psql -d [your_new_db] -f [path_to_file]`. 
    - It might be a good idea at this point to rename the migration file so it reflects the date/time you're running it at.
    - As written, the migration file contains fields username, password_digest, and email. You might need to add more for your particular needs -- you should do that now.
- In one terminal instance, run `npm start` or `yarn start` (or `npm run dev` or `yarn dev`)
- In another terminal instance, run `npm start` or `yarn start`
- The React app will be running on port 3000, and the Express app will be running on port 3001.

### Deployment

You should not attempt to deploy this app in a two-server form. Instead, use the `predeploy` script (`npm run predeploy`) from the root directory. This will create a production build of the React app, using the `build` utility provided with `create-react-app`, and more it into the `public` directory of the Express app. In this way, the React app is served directly from the Express app.

# Server

## Structure

Instead of following a traditional MVC file structure, this app makes use of a "domain" structure. Each domain-specific folder contains a model, a controller, middlewares, and routes specific to that domain.

For example, for a todo app, the file tree might resemble this:

```bash
.
├── api
│   ├── index.js # Routes, sets up `/api/todos` and `/api/users` endpoints
│   ├── todos
│   │   ├── Todo.js # model
│   │   ├── TodoSchema.js 
│   │   ├── controller.js
│   │   ├── index.js # routes
│   │   └── middlewares.js
│   ├── users
│   │   ├── User.js # model
│   │   ├── UserSchema.js 
│   │   ├── controller.js
│   │   ├── index.js # routes
│   │   └── middlewares.js
│   └── utils # utilities
│       └── index.js 
└── server.js 
```

## Adding New Models

The models in this app are prototype-based, and have a specific set of described behavior.

- One can call `ModelName.method` for actions that reference the collection of data as a whole. 
    - For example, one might find a todo of a specific ID by calling `Todo.findById(id)`, or find all todos by calling `Todo.findAll()`. 
    - These collection-level methods are available on the model itself, but not on instances of that model. 
    - Deletion is considered a collection-level action.
- One can use the syntax `new ModelName` to create a new instance of the model, which has methods that are specific to one record in the collection. 
    - For example, one might create a new todo record and save it by saying `new Todo(todoValues).save()`, or update a todo by saying `myTodoInstance.update(changes)`.
    - These record-level methods are available on instances of the model, but not on the model itself.
- When a new instance is created using `new ModelName`, the values are verified against a preset schema before any action occurs.
- Instances are not modified directly (i.e. `instance.prop = 'thing'`) but instead alter themselves (i.e. `instance._modify({ prop: thing })`).

The `utils` directory within the `api` directory contains some utility functions to help us set this functionality up. 

### Building a Todo Model

Let's say we wanted to build out this todo app in earnest. To create our todo model, we'd first need to set up our todo domain: a `todos` folder within `api`. Then, we'd create two files: `Todo.js` and `TodoSchema.js`.

#### The Schema

Within `TodoSchema.js`, we're going to describe the schema we want to use for each todo. The schema is an array of objects, which contain the following properties:

- `key`: The name of the property (most commonly the column name)
- `type`: The datatype we're expecting for this value
- `optional`: A boolean describing whether or not the value is optional (defaults to `false`)
- `regexp` and `regexpMessage`: If you need the value to match a regular expression (i.e. no spaces, email address, url), use the `regexp` field. `regexpMessage` is used to describe the regular expression's purpose (i.e. "Must be a valid email address".)
- `otherCondition` and `otherConditionMessage`: `otherCondition` needs to be a method that accepts a value and returns either true or false (i.e. the value needs to be one of a specified set, etc). `otherConditionMessage` is used to describe the condition's purpose.

Our `TodoSchema` might thus look like this:

```js
module.exports = [
  {
    key: 'id',
    type: 'number',
    optional: true // when the user inputs a todo and we first validate it, it has no ID
  }, {
    key: 'title',
    type: 'string'
  }, {
    key: 'description',
    type: 'string'
  }, {
    key: 'category',
    type: 'string',
    otherCondition: (val) => ['Home', 'Work', 'School', 'Personal'].includes(val),
    otherConditionMessage: 'Category must be Home, Work, School, or Personal.'
  }
]
```

#### The Model

In `Todo.js`, we first need to import our database. Then, we write a constructor function that describes a new Todo:

```js
const db = require('../../db/config')

function Todo({ id = null, title, description, category }) {
  this.id = this._validate(id, 'id')
  this.title = this._validate(title, 'title')
  this.description = this._validate(description, 'description')
  this.category = this._validate(category, 'category')
}
```

Note that we're passing an object in as an argument (using ES6 destructuring), and that we're using a method `_validate` to validate the properties we're recieving from the user. We get the `_validate` method from `utils` and apply it like so:

```js
const TodoSchema = require('./TodoSchema')
const { modelUtils, modelStatics } = require('../utils')
Todo.prototype = Object.assign(Todo.prototype, modelUtils(TodoSchema))
```

This gives us `_modify` and `_validate` attached to `Todo.prototype`, which means they'll be available to any instance of `Todo`.

We also need to attach the collection-level methods (`findAll`, `findById`, `delete`). 

First, we generate the todo statics using `modelStatics`, passing in the database instance and the name of the table that we're planning to use for our todos:

```js
const todoStatics = modelStatics(db, 'todos')
```

Then, if we need to add any other static methods, we attach them to the `todoStatics`. For example, I think a `findByCategory` functionality would be nice:

```js
todoStatics.findByCategory = (category) => (
  db.manyOrNone(`SELECT * FROM todos WHERE category = $1`, category)
)
```

Finally, we use `Object.setPrototypeOf` to attach the static methods directoy to the Todo constructor. This means we can call the methods on `Todo` but **not** on any **instances** of `Todo`.

```js
Object.setPrototypeOf(Todo, todoStatics)
```

Once our statics are set up, we can add any instance-level behavior we need:

```js
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
```

## Routes & Controllers

Routes for new domains should be added to `/api/index.js`, like so:

```js
apiRouter.use('/todos', require('./todos'))
```

Controllers should have a middleware signature and make use of model methods.

It should be possible to use one controller method in multiple domain routes. 

If a route needs user information and also information about todos belonging to a particular user, one should be able to grab the user `show` controller method and the todos `showByUser` controller method and use both of them in the same route.

Any time a controller ends up with data that it needs to send back to the client, it should attach that data to `res.locals.data` and then call `next`.

## `send`

`send` is a little utility function that should be at the end of every route. It simply sends back whatever happens to be in `res.locals.data`, with the status that is in `res.locals.status`.

```js
module.exports = (req, res) => {
  const { status, data } = res.locals
  res.status(status || 200).json(data)
}
```

# Client

The client in this app has been bootstrapped with `create-react-app` and thus has access to everything that CRA gives you -- hot reloading, build scripts, ejection capabilities, etc. A few things to keep in mind:

- Make sure the proxy in `package.json` matches the port that the server is running on.
- Any `fetch` request to the backend must have `credentials: 'include'` as part of the request settings. Otherwise, the backend will not have access to `req.user`.

# Acknowledgements & Licensing Details

The passport setup is based on the work of [Vincent Abruzzo](https://github.com/thoughtbyte), who has also been an inspiration and encouragement as I worked on this project. I'd also like to acknowledge [Jason Seminara](https://github.com/jasonseminara) and [Ari Brenner](https://github.com/aribrenner) for the many, many conversations that led to some of the conventions you see here.

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png" /></a> This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>. As such, it _cannot be used in an instructional capacity_ by bootcamps as a part of their curriculum, as that falls under commercial use. Other commercial ventures wishing to build on this base may contact me.

Dragon by Angela Dinh from the Noun Project (a reference, of course, to [The Dragonriders of Pern](https://en.wikipedia.org/wiki/Dragonriders_of_Pern))
