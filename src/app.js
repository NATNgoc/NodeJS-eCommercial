const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')

const app = express()

//init db
require('./dbs/init.mongdb')
//init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
//init DB
require('./dbs/init.mongdb')
// //init route
require('./routes/access/index')(app)


module.exports = app


