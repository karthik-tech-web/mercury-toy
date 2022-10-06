const joi = require('celebrate').Joi;

module.exports.options = {
    abortEarly: false,
    convert: true,
    stripUnknown: true,
};

module.exports.add = {
    body: joi.object().keys({
        geoLocation: joi.string().required(),
        address1: joi.string().required(),
        address2: joi.string().allow('', null).optional(),
        landMark: joi.string().allow('', null).optional(),
        addressType: joi.number().required(),
        defaultAddress: joi.boolean().required(),
        otherUserName: joi.when('addressType', { is: 4, then: joi.string().required(), otherwise: joi.optional() }),
        receiverName: joi.when('addressType', { is: 3, then: joi.string().required(), otherwise: joi.optional() }),
        receiverPhoneNo: joi.when('addressType', { is: 3, then: joi.string().required(), otherwise: joi.optional() }),
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
        geoLocation: joi.string().required(),
        address1: joi.string().required(),
        address2: joi.string().allow('', null).optional(),
        landMark: joi.string().allow('', null).optional(),
        addressType: joi.number().required(),
        defaultAddress: joi.boolean().required(),
        otherUserName: joi.when('addressType', { is: 4, then: joi.string().required(), otherwise: joi.optional() }),
        receiverName: joi.when('addressType', { is: 3, then: joi.string().required(), otherwise: joi.optional() }),
        receiverPhoneNo: joi.when('addressType', { is: 3, then: joi.string().required(), otherwise: joi.optional() }),
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
