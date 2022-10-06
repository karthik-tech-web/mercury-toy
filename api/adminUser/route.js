/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();
const { celebrate } = require('celebrate');
const c = require('../../system/utils/controller-handler');
const schema = require('./schema');
const controller = require('./controller');

router.get('/:data/:type', celebrate(schema.getUserDetails, schema.options), c(controller.getUserDetails, (req, res, next) => [req.params, req.query]));

router.put('/:userId', celebrate(schema.updateUser, schema.options), c(controller.updateUser, (req, res, next) => [req.params, req.body]));

module.exports = router;