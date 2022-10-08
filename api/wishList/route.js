/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();
const { celebrate } = require('celebrate');
const c = require('../../system/utils/controller-handler');
const schema = require('./schema');
const controller = require('./controller');

router.post('/', celebrate(schema.add, schema.options), c(controller.add, (req, res, next) => [req.body]));

router.put('/remove', celebrate(schema.remove, schema.options), c(controller.remove, (req, res, next) => [req.body]));

router.get('/list/:userId', celebrate(schema.getWishListByUser, schema.options), c(controller.getWishListByUser, (req, res, next) => [req.params, req.query]));

module.exports = router;
