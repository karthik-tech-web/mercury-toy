/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();
const { celebrate } = require('celebrate');
const c = require('../../system/utils/controller-handler');
const schema = require('./schema');
const controller = require('./controller');

router.post('/', celebrate(schema.addCart, schema.options), c(controller.addCart, (req, res, next) => [req.body]));

router.delete('/:cartId', celebrate(schema.removeCart, schema.options), c(controller.removeCart, (req, res, next) => [req.params]));

router.put('/:cartId', celebrate(schema.updateCart, schema.options), c(controller.updateCart, (req, res, next) => [req.params, req.body]));

router.get('/:cartId', celebrate(schema.getByIdCart, schema.options), c(controller.getByIdCart, (req, res, next) => [req.params]));

router.get('/list/:userId', celebrate(schema.getByUserIdCart, schema.options), c(controller.getByUserIdCart, (req, res, next) => [req.params]));

module.exports = router;