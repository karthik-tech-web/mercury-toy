const joi = require('celebrate').Joi;

module.exports.options = {
    abortEarly: false,
    convert: true,
    stripUnknown: true,
};

module.exports.addConfig = {
    body: joi.object().keys({
        key: joi.string().required(),
        value: joi.required(),
        external: joi.boolean().required(),
        status: joi.number().optional(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.getConfigList = {
    params: joi.object().keys({
        // user_id: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.getConfig = {
    params: joi.object().keys({
        config_id: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.updateConfig = {
    params: joi.object().keys({
        config_id: joi.string().required(),
    }),
    body: joi.object().keys({
        key: joi.string().optional(),
        value: joi.optional(),
        external: joi.boolean().optional(),
        status: joi.number().optional(),
        updated_by: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.deleteConfig = {
    params: joi.object().keys({
        config_id: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};