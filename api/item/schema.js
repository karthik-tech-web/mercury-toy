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
        brand: joi.string().required(),
        ageRange: joi.number().allow('', null).optional(),
        color: joi.string().allow('', null).optional(),
        weight: joi.number().allow('', null).optional(),
        length: joi.number().allow('', null).optional(),
        height: joi.number().allow('', null).optional(),
        width: joi.number().allow('', null).optional(),
        installation: joi.boolean().allow('', null).optional(),
        battery: joi.boolean().allow('', null).optional(),
        youtubeLink: joi.string().allow('', null).optional(),
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
        ageRange: joi.number().allow('', null).optional(),
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
        brand: joi.string().required(),
        ageRange: joi.number().allow('', null).optional(),
        color: joi.string().allow('', null).optional(),
        weight: joi.number().allow('', null).optional(),
        length: joi.number().allow('', null).optional(),
        height: joi.number().allow('', null).optional(),
        width: joi.number().allow('', null).optional(),
        installation: joi.boolean().allow('', null).optional(),
        battery: joi.boolean().allow('', null).optional(),
        youtubeLink: joi.string().allow('', null).optional(),
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