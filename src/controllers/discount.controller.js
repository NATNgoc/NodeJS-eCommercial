const DiscountService = require('../services/discount.service')
const SuccesResponse = require('../core/success.response')
const { HEADER } = require('../auth/authUtils')
class DiscountController {

    createNewDiscountCode = async (req, res, next) => {
        return new SuccesResponse.CreatedResponse({
            ...req.body,
            message: "Create code succesfully",
            metaData: await DiscountService.generateDiscountCode(req.body, req.headers[HEADER.client_id])
        }).send(res)
    }

    findAllProductByCode = async (req, res, next) => {
        return new SuccesResponse.OkResponse({
            ...req.body,
            message: "Create code succesfully",
            metaData: await DiscountService.getAllProductByDiscountCode({ ...req.query }, req.params.discountCode, req.headers[HEADER.client_id])
        }).send(res)
    }
}
const discountController = new DiscountController()
module.exports = discountController