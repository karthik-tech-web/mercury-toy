const joi = require('celebrate').Joi;

module.exports.options = {
    abortEarly: false,
    convert: true,
    stripUnknown: true,
};

module.exports.add = {
    body: joi.object().keys({
        fullName: joi.string().required(),
        address1: joi.string().required(),
        address2: joi.string().allow('', null).optional(),
        city: joi.string().required(),
        state: joi.string().required(),
        pincode: joi.string().required(),
        phoneNo: joi.string().required(),
        alternatePhn: joi.string().required(),
        addressType: joi.number().required(),
        landMark: joi.string().allow('', null).optional(),
        defaultAddress: joi.boolean().required(),
        userId: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.list = {
    params: {
        userId: joi.string().required(),
    },
    query: {
        limit: joi.number().required(),
        offset: joi.number().required(),
        tenantId: joi.string().required(),
    },
};

module.exports.getAddress = {
    body: joi.object().keys({}),
    params: {
        addressId: joi.string().required(),
    },
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.update = {
    body: joi.object().keys({
        fullName: joi.string().required(),
        address1: joi.string().required(),
        address2: joi.string().allow('', null).optional(),
        city: joi.string().required(),
        state: joi.string().required(),
        pincode: joi.string().required(),
        phoneNo: joi.string().required(),
        alternatePhn: joi.string().required(),
        addressType: joi.number().required(),
        landMark: joi.string().allow('', null).optional(),
        defaultAddress: joi.boolean().required(),
    }),
    params: {
        addressId: joi.string().required(),
    },
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.delete = {
    body: joi.object().keys({}),
    params: {
        addressId: joi.string().required(),
    },
    query: {
        tenantId: joi.string().required(),
    },
};
