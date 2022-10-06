/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();
const { celebrate } = require('celebrate');
const c = require('../../system/utils/controller-handler');
const schema = require('./schema');
const controller = require('./controller');
const authorizeMiddleWare = require('../../system/middleware/authorize');

router.post('/success-payment', celebrate(schema.successPayment, schema.options), c(controller.successPayment, (req, res, next) => [req.body]));

router.post('/failure-payment', celebrate(schema.paymentFailure, schema.options), c(controller.paymentFailure, (req, res, next) => [req.body]));

module.exports = router;