const joi = require('celebrate').Joi;

module.exports.options = {
    abortEarly: false,
    convert: true,
    stripUnknown: true,
};

module.exports.signIn = {
    body: joi.object().keys({
        // displayName: joi.string().required(),
        // countryCode: joi.string().required(),
        // phone: joi.string().required(),
        // email: joi.string().required(),
        // password: joi.string().required(),
        // inviteCode: joi.string().allow(null, '').optional(),
        // status: joi.number().optional(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.checkUserExist = {
    query: joi.object().keys({
        email: joi.string().required(),
        tenantId: joi.string().required(),
    }),
};

module.exports.login = {
    body: joi.object().keys({
        // loginType: joi.number().required(), // 1. userId 2.fireBaseId 3.Email
        // user_id: joi.when('loginType', { is: 1, then: joi.string().required(), otherwise: joi.optional() }),
        // firebase_id: joi.when('loginType', { is: 2, then: joi.string().required(), otherwise: joi.optional() }),
        // email: joi.when('loginType', { is: 3, then: joi.string().required().lowercase(), otherwise: joi.optional() }),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.logout = {
    params: joi.object().keys({
        firebaseId: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};