
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
        return await this.createAccessToken({
            userid: userInfo._id,
            email: userInfo.email
        }, privateKey,
            {
                algorithm: 'RS256',
                expiresIn: '1h'
            })
    }

    static genPubicAndPrivateKey = async () => {
        const { privateKey, publicKey } = await crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
        })
        return { privateKey, publicKey }
    }

    static async updateTokenKey(userId, publicKey) {
        const publicKeyString = publicKey.toString()
        const filter = { userid: userId }
        const currentUser = await shopModel.findOne(filter).lean()
        const updateObject = {
            userid: userId,
            publicKey: publicKey,
            refreshKey: [publicKey]
        }

        console.log(updateObject)
        const options = { upsert: true, new: true };
        if (!currentUser) {
            await tokenModel.findOneAndReplace(filter, updateObject, options)
        } else {
            await tokenModel.create(updateObject)
        }
    }

    static async createAccessToken(payload, privateKey, header) {
        const accessToken = await jwt.sign(payload, privateKey, header)
        return accessToken
    }


    static async verify() {
        const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2NTI3ODQwM2EzNjlkNDgzNjFjYjQ0MTMiLCJlbWFpbCI6Im5ndXllbmF0bjIwMDNAZ21haWwuY29tIiwiaWF0IjoxNjk3MDg4NTE5LCJleHAiOjE2OTcwOTIxMTl9.pX4Fs6BhsZaDJxcXAJtX4JmkQg0yQDZE6qbxVATNxzfDQtk2CqeD4okhz7CQaNyuRTTkFBlJM799QVTfT5c2uPsTCrqTBd9iyv1tIyYrrA2iPaLUgF52c4kUk7wdKnGdRjuTZbKjjAVO18sz6cb5LvS240UD_EzyRPvZjCdoQu72w4uBgky6HqkIvkafhJhbMEzET7SJLYDaaH9vED8fFDoceFV0acfmqbPVgAHmxUuuvpMzNmgs4NTbPgC94a05rABRNB4Dq2BqRuWWXyXheDJ_6uIsAjQt_eTqDz0xxRHEcCe49V7PHhNNU7Y4Ys3krE3nm86J7IuUgtgk-C96A4c9RRsVxaIsxwVa3Dz3NQJTuZPz_ePhTNhLukJUWCgKN2FSawSImUfszoJKPAb02rPo8UMLTAKJMJes0h7Gm1UYB06aHnl-yAIREm2HOkE-Sti3tseuIi0t7nD597RhbXJvEg9UPyU-5eIFOsrFQlLh1GKq9OUW0me94-QhqecEE1BNEfz7p0H_32GA-0HlJFWA6GTpst9YgUVkLXjfZ6jUvA46egIUoAG9rtIPZv0vjuK9ItESeqQaYAcadVHKI78bLy7r_lDJ5NfHJlgr_75lmt0V6VGN81jCJseMfXx4v75aqP8SgpM4wo86iugdGhFeNhXEDDI6gNWsdVI_ROA"
        const { publicKey } = tokenModel.find({})
        const hasedPublickey = await crypto.createPublicKey(publicKey)
        jwt.verify(token, hasedPublickey, (err, result) => {
            if (err) {
                console.log({
                    message: err
                })
            }
            console.log({
                message: "success",
                result: result
            })

        })
    }
}


module.exports = TokenService

