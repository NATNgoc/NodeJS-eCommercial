
const devConfig = require('../configs/config.mongodb');
const { default: mongoose } = require('mongoose');

// const url = 'mongodb://127.0.0.1:27017';
const connectString = 'mongodb://' + devConfig.db.host + ":" + devConfig.db.port + "/" + devConfig.db.name

class DatabaseMongoDB {
    constructor() {
        this.connect();
    }

    async connect() {
        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }
        mongoose.connect(connectString).then(_ => {
            console.log("Connect mongoDB succesfully")
        }).catch(err => {
            console.log("Have some error in connection to MongoDB", err)
        })
    }

    static getInstance() {
        if (!DatabaseMongoDB.instance) {
            DatabaseMongoDB.instance = new DatabaseMongoDB()
        }
        return DatabaseMongoDB.instance
    }
}

const instanceMongodb = DatabaseMongoDB.getInstance()

module.exports = instanceMongodb
