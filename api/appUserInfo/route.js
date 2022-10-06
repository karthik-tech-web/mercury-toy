/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();
const { celebrate } = require('celebrate');
const c = require('../../system/utils/controller-handler');
const schema = require('./schema');
const controller = require('./controller');
const fileUpload = require('../../system/middleware/process-upload');
const uploadFields = [{ name: 'photo', maxCount: 1 }, { name: 'gallery', maxCount: 10 }];

router.get('/', celebrate(schema.getAppInfo, schema.options), c(controller.getAppInfo, (req, res, next) => [req.params]));

router.put('/update/:infoId', fileUpload('IMAGE', uploadFields), celebrate(schema.updateInfo, schema.options), c(controller.updateInfo, (req, res, next) => [req.params, req.files, req.body]));

module.exports = router;