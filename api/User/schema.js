const joi = require('celebrate').Joi;

module.exports.options = {
    abortEarly: false,
    convert: true,
    stripUnknown: true,
};

module.exports.getUserDetails = {
    params: joi.object().keys({
        data: joi.string().required(),
        type: joi.number().required(), // 1.schemaId 2.firebaseId 3.Email
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.updateUser = {
    body: joi.object().keys({
        displayName: joi.string().required(),
        phoneNumber: joi.string().required(),
        email: joi.string().required(),
        inviteCode: joi.string().allow(null, '').optional(),
    }),
    params: joi.object().keys({
        userId: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.updatePassword = {
    body: joi.object().keys({
        newPassword: joi.string().required(),
        confirmPassword: joi.string().required(),
        type: joi.number().required(),
    }),
    params: joi.object().keys({
        userId: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.twoFactorAuthentication = {
    params: {
        userId: joi.string().required(),
    },
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.twoFactorEnable = {
    body: joi.object().keys({
        authCode: joi.string().required(),
        authKey: joi.string().required(),
    }),
    params: {
        userId: joi.string().required(),
    },
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.twoFactorDisable = {
    body: joi.object().keys({
        authCode: joi.string().required(),
    }),
    params: {
        userId: joi.string().required(),
    },
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.profileImageUpdate = {
    params: joi.object().keys({
        userId: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.addDisplayName = {
    body: joi.object().keys({
        displayName: joi.string().required(),
        type: joi.number().required(),
        userId: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};