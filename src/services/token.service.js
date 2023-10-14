
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
        const { accessToken, refreshToken } = await this.createPairToken({
            userid: userInfo._id,
            email: userInfo.email
        }, privateKey
        )
        await this.updateTokenKey(userInfo._id, publicKey, refreshToken)
        return {
            accessToken,
            refreshToken
        }


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
        const updateObject = {
            userid: userId,
            publicKey: publicKeyString,
            refreshToken: refreshKey,
            refreshTokenUsed: []
        }
        console.log("Update Object", updateObject)
        const options = { upsert: true, new: true };
        await tokenModel.findOneAndUpdate(filter, updateObject, options)
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

