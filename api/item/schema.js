const joi = require('celebrate').Joi;

module.exports.options = {
    abortEarly: false,
    convert: true,
    stripUnknown: true,
};

module.exports.addItem = {
    body: joi.object().keys({
        name: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required(),
        offerPrice: joi.number().allow('', null).optional(),
        category: joi.string().required(),
        stockCount: joi.number().required(),
        gstPercent: joi.number().allow('', null).optional(),
        status: joi.number().allow('', null).optional(),
        createdBy: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.getItemList = {
    query: joi.object().keys({
        category: joi.string().allow('', null).optional(),
        minPrice: joi.number().allow('', null).optional(),
        maxPrice: joi.number().allow('', null).optional(),
        userId: joi.string().required(),
        enable: joi.boolean().allow('', null).optional(),
        available: joi.boolean().allow('', null).optional(),
        tenantId: joi.string().required(),
    }),
};

module.exports.getItem = {
    params: joi.object().keys({
        itemId: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.updateItem = {
    params: joi.object().keys({
        itemId: joi.string().required(),
    }),
    body: joi.object().keys({
        name: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required(),
        offerPrice: joi.number().allow('', null).optional(),
        category: joi.string().required(),
        stockCount: joi.number().required(),
        gstPercent: joi.number().allow('', null).optional(),
        status: joi.number().allow('', null).optional(),
        updatedBy: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.deleteItem = {
    params: joi.object().keys({
        itemId: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};