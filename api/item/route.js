/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();
const { celebrate } = require('celebrate');
const c = require('../../system/utils/controller-handler');
const schema = require('./schema');
const controller = require('./controller');
const fileUpload = require('../../system/middleware/process-upload');

const uploadFields = [{ name: 'image', maxCount: 10 }];

router.post('/', fileUpload('IMAGE', uploadFields), celebrate(schema.addItem, schema.options), c(controller.addItem, (req, res, next) => [req.files, req.body]));

router.get('/list', celebrate(schema.getItemList, schema.options), c(controller.getItemList, (req, res, next) => [req.query]));

router.get('/:itemId', celebrate(schema.getItem, schema.options), c(controller.getItem, (req, res, next) => [req.params]));

router.put('/:itemId', fileUpload('IMAGE', uploadFields), celebrate(schema.updateItem, schema.options), c(controller.updateItem, (req, res, next) => [req.params, req.files, req.body]));

router.delete('/:itemId', celebrate(schema.deleteItem, schema.options), c(controller.deleteItem, (req, res, next) => [req.params]));

module.exports = router;