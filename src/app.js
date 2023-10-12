const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const { JsonWebTokenError } = require('jsonwebtoken')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const app = express()
const TokenService = require('./services/token.service')

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


