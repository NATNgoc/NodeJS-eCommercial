const Electronic = require('./electronic.stragegy')
const Clothing = require('./clothing.stragegy')

class ProductFactory {

    static registeredClassType = {}

    static registerNewClassType = (type, classReference) => {
        ProductFactory.registeredClassType[type] = classReference
    }

    static getProduct(type) {
        const productClass = ProductFactory.registeredClassType[type]
        if (!productClass) {
            throw new ErrorResponse.NotFoundError("Not valid type of product")
        }
        return productClass
    }
}

ProductFactory.registerNewClassType('Electronic', Electronic)
ProductFactory.registerNewClassType('Clothing', Clothing)

module.exports = ProductFactory