class AccessController {

    signUp = async (req, res, next) => {
        try {
            console.log('[P]::signUp::', req.body)
            return res.status(201).send({
                code: 200001 // code do bene dev thong nhat
            })
        } catch (err) {
            return res.status(500).send(err)
        }
    }
}

module.exports = new AccessController()