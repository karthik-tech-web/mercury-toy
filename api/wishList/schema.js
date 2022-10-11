const joi = require('celebrate').Joi;

module.exports.options = {
    abortEarly: false,
    convert: true,
    stripUnknown: true,
};

module.exports.add = {
    body: joi.object().keys({
        productId: joi.string().required(),
        userId: joi.string().required(),
    }),
};

module.exports.remove = {
    body: joi.object().keys({
        productId: joi.string().required(),
        userId: joi.string().required(),
    }),
};

module.exports.getWishListByUser = {
    params: joi.object().keys({
        userId: joi.string().required(),
    }),
    query: {
        sortBy: joi.string().allow(null, '').optional(),
        sortDir: joi.string().allow(null, '').optional(),
        limit: joi.number().required(),
        offset: joi.number().required(),
    },
};