/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();
const { celebrate } = require('celebrate');
const c = require('../../system/utils/controller-handler');
const schema = require('./schema');
const controller = require('./controller');
const fileUpload = require('../../system/middleware/process-upload');
const uploadFields = [{ name: 'image', maxCount: 5 }];

router.post('/', fileUpload('IMAGE', uploadFields), celebrate(schema.addCategory, schema.options), c(controller.addCategory, (req, res, next) => [req.body, req.files]));

router.get('/list', celebrate(schema.getCategoryList, schema.options), c(controller.getCategoryList, (req, res, next) => [req.query]));

router.get('/:categoryId', celebrate(schema.getCategory, schema.options), c(controller.getCategory, (req, res, next) => [req.params]));

router.put('/:categoryId', fileUpload('IMAGE', uploadFields), celebrate(schema.updateCategory, schema.options), c(controller.updateCategory, (req, res, next) => [req.params, req.body, req.files]));

router.delete('/:categoryId', celebrate(schema.deleteCategory, schema.options), c(controller.deleteCategory, (req, res, next) => [req.params]));

module.exports = router;