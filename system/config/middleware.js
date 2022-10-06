// const isEmpty = require('lodash.isempty');
const boom = require('@hapi/boom');

const originWhitelist = [
    'http://localhost:8083',
    'http://localhost:4200',
];

const checkCorsOrigin = (origin, callback) => {
    if (originWhitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
    } else {
        callback(new Error('Not allowed by CORS'));
    }
};

const cors = {
    // origin: checkCorsOrigin,
    origin: '*',
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization,stripe-signature,jwt-token',
    methods: 'GET,HEAD,PUT,POST,DELETE,OPTIONS',
};

const morganRequestFormat = (tokens, req, res) => `[${[
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens['response-time'](req, res),
].join('][')}]`;


// eslint-disable-next-line consistent-return
const tenantCheck = async (req, res, next) => {
    const tenantId = req.query.tenantId ? req.query.tenantId : '';
    if (typeof tenantId === 'undefined' || tenantId === '') {
        return next(boom.badRequest('Missing mandatory parameters!'));
    }
    next();
};

module.exports = {
    cors,
    morganRequestFormat,
    tenantCheck,
};