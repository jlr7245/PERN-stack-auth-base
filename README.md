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
    - [New Models](#new-models)
    - [Routes & Controllers](#routes-controllers)
    - [`send`](#send)
- [Client](#client)
    - [Redux Setup](#redux-setup)
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

### Structure

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



# Acknowledgements & Licensing Details

The passport setup is based on the work of [Vincent Abruzzo](https://github.com/thoughtbyte), who has also been an inspiration and encouragement as I worked on this project. I'd also like to acknowledge [Jason Seminara](https://github.com/jasonseminara) and [Ari Brenner](https://github.com/aribrenner) for the many, many long conversations that led to some of the conventions you see here.

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png" /></a> This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>. As such, it _cannot be used in an instructional capacity_ by bootcamps as a part of their curriculum, as that falls under commercial use. (I am, however, available for guest lectures.)
