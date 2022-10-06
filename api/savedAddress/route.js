const express = require('express');
const trimRequest = require('trim-request');

const router = express.Router();
const { celebrate } = require('celebrate');
const c = require('../../system/utils/controller-handler');
const schema = require('./schema');
const controller = require('./controller');

router.post('/', trimRequest.body, celebrate(schema.add, schema.options), c(controller.add, (req) => [req.body]));

router.get('/:userId/list', celebrate(schema.list, schema.options), c(controller.list, (req) => [req.params, req.query]));

router.get('/:addressId', celebrate(schema.getAddress, schema.options), c(controller.getAddress, (req) => [req.params, req.body]));

router.put('/:addressId', celebrate(schema.update, schema.options), c(controller.update, (req) => [req.params, req.body]));

router.delete('/:addressId', celebrate(schema.delete, schema.options), c(controller.deleteRecord, (req) => [req.params]));

module.exports = router;