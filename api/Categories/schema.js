const joi = require('celebrate').Joi;

module.exports.options = {
    abortEarly: false,
    convert: true,
    stripUnknown: true,
};

module.exports.addCategory = {
    body: joi.object().keys({
        name: joi.string().required(),
        value: joi.string().required(),
        status: joi.number().allow('', null).optional(),
        createdBy: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.getCategoryList = {
    query: joi.object().keys({
        type: joi.number().allow('', null).optional(), // 1.category list 2.subCategory list
        category: joi.string().allow('', null).optional(),
        tenantId: joi.string().required(),
    }),
};

module.exports.getCategory = {
    params: joi.object().keys({
        categoryId: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.updateCategory = {
    params: joi.object().keys({
        categoryId: joi.string().required(),
    }),
    body: joi.object().keys({
        name: joi.string().required(),
        value: joi.string().required(),
        status: joi.number().allow('', null).optional(),
        updatedBy: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.deleteCategory = {
    params: joi.object().keys({
        categoryId: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};