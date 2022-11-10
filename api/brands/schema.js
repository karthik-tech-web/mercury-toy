const joi = require('celebrate').Joi;

module.exports.add = {
    body: joi.object().keys({
        name: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.remove = {
    params: joi.object().keys({
        brandId: joi.string().required(),
    }),
    query: {
        tenantId: joi.string().required(),
    },
};

module.exports.getList = {
    query: {
        tenantId: joi.string().required(),
    },
};
