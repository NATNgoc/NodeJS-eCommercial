
const crypto = require('crypto')
const tokenModel = require('../models/token.model')
const jwt = require('jsonwebtoken')
const shopModel = require('../models/shop.model')
const { isEmptyObject } = require('../utils/index')
const { Mongoose, Types } = require('mongoose')
const { actionTokenService } = require('../utils/index')
class TokenService {
    static genToken = async (shop, action = actionTokenService["CREATE_NEW_TOKEN"], keyStore = null) => {
        //create publickey , private
        //Luu keypublic vao db
        //sign Token bang private key
        const { privateKey, publicKey } = await this.genPubicAndPrivateKey()
        console.log("Shop", shop)
        const { accessToken, refreshToken } = await this.createPairToken(
            {
                userid: shop._id,
                email: shop.email
            },
            privateKey,
            {
                algorithm: 'RS256',
                expiresIn: '2days'
            },
            {
                algorithm: 'RS256',
                expiresIn: '7days'
            }
        )
        if (action == actionTokenService["CREATE_NEW_TOKEN"]) {
            await this.updateNewTokenKey(shop._id, publicKey, refreshToken)
        } else {
            await this.updateRefreshTokenKey(keyStore, publicKey, refreshToken)
        }
        return {
            accessToken,
            refreshToken
        }


    }

    static async updateRefreshTokenKey(keyStore, publicKeyNew, refreshToken) {
        const publicKeyString = publicKeyNew.toString()
        const refreshKeyString = refreshToken.toString()
        const refreshUsedToken = keyStore.refreshToken
        const filter = { _id: new Types.ObjectId(keyStore._id) }
        await tokenModel.updateOne(filter, {
            $set: {
                publicKey: publicKeyString,
                refreshToken: refreshKeyString
            },
            $addToSet: {
                refreshTokenUsed: refreshUsedToken
            }
        })
    }

    static genPubicAndPrivateKey = async () => {
        const { privateKey, publicKey } = await crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096, // Độ mạnh của thuật toán generateKey
            publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
        })
        return { privateKey, publicKey }
    }

    static async updateNewTokenKey(userId, publicKey, refreshKey) {
        const publicKeyString = publicKey.toString()
        const refreshKeyString = refreshKey.toString()
        const filter = { userid: new Types.ObjectId(userId) }
        const updateObject = {
            userid: userId,
            publicKey: publicKeyString,
            refreshToken: refreshKeyString,
            refreshTokenUsed: []
        }
        const options = { upsert: true };
        await tokenModel.findOneAndUpdate(filter, updateObject, options)
    }

    static async createPairToken(payload, privateKey, optionAccessToken, optionRefreshToken) {
        const accessToken = await jwt.sign(payload, privateKey, optionAccessToken)
        const refreshToken = await jwt.sign(payload, privateKey, optionRefreshToken)
        return {
            accessToken,
            refreshToken
        }
    }

    static async findByShopId(id) {
        const shop = await tokenModel.findOne({ userid: new Types.ObjectId(id) }).lean()
        return shop
    }
    static removeTokenById = async (id) => {
        const result = await tokenModel.deleteOne({
            _id: new Types.ObjectId(id)
        })
        return result;
    }
    static removeTokenByUserId = async (userId) => {
        const result = await tokenModel.deleteOne({
            userid: new Types.ObjectId(userId)
        })
        return result;
    }
}


module.exports = TokenService

