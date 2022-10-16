const joi = require('celebrate').Joi;

module.exports.createOrder = {
    body: joi.object().keys({
        products: joi.string().required(), // productId1|productId2
        userIp: joi.string().allow(null, '').optional(),
        discountCode: joi.string().allow(null, '').optional(), // productId1~DiscountCode|productId2~DiscountCode
        actualAmount: joi.number().required(),
        orderAmount: joi.number().required(),
        userId: joi.string().required(),
        paymentMethod: joi.number().required(),
        paymentGateway: joi.number().required(),
        orderId: joi.when('paymentGateway', { is: 1, then: joi.string().required(), otherwise: joi.optional() }),
        address: joi.string().required(),
        addressId: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.updateOrder = {
    body: joi.object().keys({
        orderId: joi.string().required(),
        type: joi.number().required(),
        statusUpdate: joi.number().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.orderDetails = {
    params: joi.object().keys({
        orderId: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.getOrderList = {
    query: joi.object().keys({
        userId: joi.string().allow('', null).optional(),
        orderStatus: joi.number().allow('', null).optional(),
        productStatus: joi.number().allow('', null).optional(),
        sortBy: joi.string().allow(null, '').optional(),
        sortDir: joi.string().allow(null, '').optional(),
        limit: joi.number().required(),
        offset: joi.number().required(),
        tenantId: joi.string().required(),
    }),
};

module.exports.productExist = {
    query: joi.object().keys({
        productId: joi.string().required(),
        tenantId: joi.string().required(),
    }),
};
