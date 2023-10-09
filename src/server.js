
const app = require('./app')
const devConfig = require('./configs/config.mongodb')
const server = app.listen(devConfig.app.port, () => {
    console.log("Welcome to eCommercial in", devConfig.app.port)
})

process.on('SIGINT', () => {
    server.close(() => { console.log("Close server", devConfig.app.port) })
})