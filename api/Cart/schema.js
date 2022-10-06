const joi = require('celebrate').Joi;

module.exports.addCart = {
    body: joi.object().keys({
        products: joi.string().required(),
        userId: joi.string().required(),
        // itemCount: joi.number().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.removeCart = {
    params: joi.object().keys({
        cartId: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.updateCart = {
    params: joi.object().keys({
        cartId: joi.string().required(),
    }),
    body: joi.object().keys({
        itemCount: joi.number().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.getByIdCart = {
    params: joi.object().keys({
        cartId: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.getByUserIdCart = {
    params: joi.object().keys({
        userId: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};
