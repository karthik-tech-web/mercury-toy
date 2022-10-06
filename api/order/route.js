/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();
const { celebrate } = require('celebrate');
const c = require('../../system/utils/controller-handler');
const schema = require('./schema');
const controller = require('./controller');

router.post('/', celebrate(schema.createOrder, schema.options), c(controller.createOrder, (req, res, next) => [req.body]));

router.put('/status-update', celebrate(schema.updateOrder, schema.options), c(controller.updateOrder, (req, res, next) => [req.body]));

router.get('/list', celebrate(schema.getOrderList, schema.options), c(controller.getOrderList, (req, res, next) => [req.query]));

router.get('/product-exist', celebrate(schema.productExist, schema.options), c(controller.productExist, (req, res, next) => [req.query]));

router.get('/:orderId', celebrate(schema.orderDetails, schema.options), c(controller.orderDetails, (req, res, next) => [req.params]));

// router.put('/:orderId', celebrate(schema.updateOrder, schema.options), c(controller.updateOrder, (req, res, next) => [req.params, req.body]));

// router.delete('/:orderId', celebrate(schema.deleteOrder, schema.options), c(controller.deleteOrder, (req, res, next) => [req.params]));

module.exports = router;