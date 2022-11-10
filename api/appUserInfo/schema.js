const joi = require('celebrate').Joi;

module.exports.options = {
    abortEarly: false,
    convert: true,
    stripUnknown: true,
};

module.exports.getAppInfo = {
    params: joi.object().keys({
        // data: joi.string().required(),
        // type: joi.number().required(), // 1.schemaId 2.firebaseId 3.Email
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.updateInfo = {
    body: joi.object().keys({
        email: joi.string().optional(),
        name: joi.string().optional(),
        phoneNumber1: joi.string().optional(),
        phoneNumber2: joi.string().optional(),
        address1: joi.string().optional(),
        address2: joi.string().optional(),
        openingDay: joi.string().optional(),
        closingDay: joi.string().optional(),
        openingTime: joi.string().optional(),
        instantDeliveryCharge: joi.number().optional(),
        closingTime: joi.string().optional(),
        gelocation: joi.string().optional(),
        active: joi.boolean().optional(),
        defaultGst: joi.number().optional(),
        dcChennai: joi.string().optional(),
        dcOuterChennai: joi.string().optional(),
    }),
    params: joi.object().keys({
        infoId: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};