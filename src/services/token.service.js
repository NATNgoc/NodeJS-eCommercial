
const crypto = require('crypto')
const tokenModel = require('../models/token.model')
const jwt = require('jsonwebtoken')
const shopModel = require('../models/shop.model')
class TokenService {
    static genToken = async (userInfo) => {
        //create publickey , private
        //Luu keypublic vao db
        //sign Token bang private key
        const { privateKey, publicKey } = await this.genPubicAndPrivateKey()
        await this.updateTokenKey(userInfo._id, publicKey)
        return await this.createPairToken({
            userid: userInfo._id,
            email: userInfo.email
        }, privateKey
        )


    }

    static genPubicAndPrivateKey = async () => {
        const { privateKey, publicKey } = await crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096, // Độ mạnh của thuật toán generateKey
            publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
        })
        return { privateKey, publicKey }
    }

    static async updateTokenKey(userId, publicKey, refreshKey) {
        const publicKeyString = publicKey.toString()
        const filter = { userid: userId }
        const currentUser = await shopModel.findOne(filter).lean()
        const updateObject = {
            userid: userId,
            publicKey: publicKeyString,
            refreshKey: [refreshKey]
        }
        const options = { upsert: true, new: true };
        if (currentUser) {
            updateObject.refreshKey = currentUser.refreshKey.push(refreshKey)
            await tokenModel.findOneAndReplace(filter, updateObject, options)
        } else {
            await tokenModel.create(updateObject)
        }
    }

    static async createPairToken(payload, privateKey) {
        const accessToken = await jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2days'
        })
        const refreshToken = await jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7days'
        })
        return {
            accessToken,
            refreshToken
        }
    }

}


module.exports = TokenService

