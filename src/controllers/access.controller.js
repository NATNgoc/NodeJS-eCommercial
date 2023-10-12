
const AccessService = require('../services/access.service')

class AccessController {

    signUp = async (req, res, next) => {
        try {
            const message = await AccessService.signUp(req.body)
            return res.status(201).send({
                code: 200001, // code do bene dev thong nhat
                message: message
            })
        } catch (err) {
            return res.status(500).send(err)
        }
    }
}
const accessController = new AccessController()
module.exports = accessController