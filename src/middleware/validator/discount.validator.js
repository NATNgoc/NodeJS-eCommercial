const ErrorResponse = require('../../core/error.response');
const { objectIdParser } = require('../../utils');
const mongoose = require('mongoose'); // Erase if already required
const validateCreateDiscountCode = async (req, res, next) => {
    const {
        discount_name,
        discount_description,
        discount_type,
        discount_value,
        discount_code,
        discount_start_at,
        discount_end_at,
        discount_max_uses,
        discount_max_use_per_user,
        discount_min_order_value,
        discount_apply_for,
        discount_product_ids
    } = req.body;
    if (!discount_name ||
        !discount_description ||
        !discount_type ||
        !discount_value ||
        !discount_code ||
        !discount_start_at ||
        !discount_end_at ||
        !discount_max_uses ||
        !discount_max_use_per_user ||
        !discount_min_order_value ||
        !discount_apply_for) {
        throw new ErrorResponse.BadRequestError("Not valid Input")
    }
    const dateStart = new Date(discount_start_at)
    const dateEnd = new Date(discount_end_at)
    const currentTime = new Date()
    if (dateStart > dateEnd) {
        throw new ErrorResponse.BadRequestError("Date start not be less or equal date end")
    }
    if (dateStart < currentTime) {
        throw new ErrorResponse.BadRequestError("Discount has expired")
    }
    if (discount_type === "percentage") {
        if (discount_value > 100 || discount_value < 0)
            throw new ErrorResponse.BadRequestError("Invalid discount value")
    }
    if (discount_apply_for === "specific") {
        if (discount_product_ids.length === 0) {
            throw new ErrorResponse.BadRequestError("Invalid discount list of specific product for discount")
        }
    } else {
        if (discount_product_ids.length > 0) {
            throw new ErrorResponse.BadRequestError("Because of all product dont push any id in discount list ids")
        }
    }

    next()
}

const validateDeleteDiscountCode = (req, res, next) => {
    const { codeId, shopId } = req.body
    if (!codeId || !shopId) {
        throw new ErrorResponse.BadRequestError("Invalid input")
    }
    next()
}

module.exports = { validateCreateDiscountCode, validateDeleteDiscountCode }