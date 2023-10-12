
const AccessService = require('../services/access.service')

class AccessController {

    signUp = async (req, res, next) => {
        try {
            const message = await AccessService.signUp(req.body)
            console.log(message.code)
            return res.status(message.code).send({
                message: message
            })
        } catch (err) {
            return res.status(500).send(err)
        }
    }
    login = async (req, res, next) => {
        try {
            const message = await AccessService.login()
        } catch (err) {

        }
    }
}
const accessController = new AccessController()
module.exports = accessController