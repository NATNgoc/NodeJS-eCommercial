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
//init access route
require('./routes/access/index')(app)
//init DB
require('./dbs/init.mongdb')

// hanlde error
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    console.error(error)
    return res.status(statusCode).json({
        code: statusCode,
        message: error.message
    })
})

module.exports = app


