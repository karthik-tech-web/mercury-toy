const joi = require('celebrate').Joi;

module.exports.successPayment = {
    body: joi.object().keys({
        orderId: joi.string().required(),
        paymentGateway: joi.string().allow(null, '').optional(),
        userId: joi.string().required(),
        userIp: joi.string().allow(null, '').optional(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};


module.exports.paymentFailure = {
    body: joi.object().keys({
        orderId: joi.string().required(),
        userId: joi.string().required(),
        userIp: joi.string().allow(null, '').optional(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};
