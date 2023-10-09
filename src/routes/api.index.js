// const express = require('express')
// const router = express.Router()
// require('dotenv').config()
// const jwt = require('jsonwebtoken')
// const initApiRoute = (app) => {
//     router.get('/login', (req, res) => {
//         const data = req.body
//         console.log(data)
//         const key = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '100s' })
//         res.status(200).send({
//             status: 'Ok',
//             message: "Login succesfully",
//             jwt: key
//         })
//     })

//     router.get('/shops', verifyToken, (req, res) => {
//         res.send({
//             shopName: 'Đồ bikini',
//             author: 'Nguyễn Anh Tuấn Ngọc'
//         })
//     })


//     return app.use('/api/v1', router)
// }

// const verifyToken = (req, res, next) => {
//     console.log(req.headers)
//     const jwtoken = req.headers.authorization
//     const key = jwtoken.split(' ')[1]
//     jwt.verify(key, process.env.ACCESS_TOKEN_SECRET_KEY, (err, data) => {
//         if (err) res.status(401).send(err)
//         next()
//     })
// }

// module.exports = initApiRoute


