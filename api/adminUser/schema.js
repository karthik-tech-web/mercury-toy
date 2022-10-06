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
    query: joi.object().keys({
        loggedInUserId: joi.string().allow('', null).optional(),
        tenantId: joi.string().required(),
    }),
};

module.exports.updateUser = {
    body: joi.object().keys({
        displayName: joi.string().allow(null, '').optional(),
        firstName: joi.string().allow(null, '').optional(),
        middleName: joi.string().allow(null, '').optional(),
        lastName: joi.string().allow(null, '').optional(),
        phone: joi.string().allow(null, '').optional(),
        countryCode: joi.string().allow(null, '').optional(),
        country: joi.string().allow(null, '').optional(),
        timeZone: joi.string().allow(null, '').optional(),
        currency: joi.string().allow(null, '').optional(),
        about: joi.string().allow(null, '').optional(),
    }),
    params: joi.object().keys({
        userId: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};
