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
        foodType: joi.number().required(),
        availableType: joi.number().required(),
        // price: joi.number().required(),
        categoryId: joi.string().required(),
        subCategoryId: joi.string().allow('', null).optional(),
        includeGst: joi.boolean().required(),
        enable: joi.boolean().required(),
        status: joi.number().allow('', null).optional(),
        createdBy: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.getItemList = {
    query: joi.object().keys({
        type: joi.number().allow('', null).optional(), // 1.category list 2.subCategory list
        categoryId: joi.string().allow('', null).optional(),
        userId: joi.string().required(),
        enable: joi.boolean().allow('', null).optional(),
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
        foodType: joi.number().required(),
        availableType: joi.number().required(),
        // price: joi.number().required(),
        categoryId: joi.string().required(),
        subCategoryId: joi.string().allow('', null).optional(),
        includeGst: joi.boolean().required(),
        enable: joi.boolean().required(),
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