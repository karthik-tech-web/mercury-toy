/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();
const {
    celebrate,
} = require('celebrate');
const c = require('../../system/utils/controller-handler');
const schema = require('./schema');
const controller = require('./controller');

router.post('/', celebrate(schema.addConfig, schema.options), c(controller.addConfig, (req, res, next) => [req.body]));

router.get('/list', celebrate(schema.getConfigList, schema.options), c(controller.getConfigList, (req, res, next) => [req.params]));

router.get('/:config_id', celebrate(schema.getConfig, schema.options), c(controller.getConfig, (req, res, next) => [req.params]));

router.put('/:config_id', celebrate(schema.updateConfig, schema.options), c(controller.updateConfig, (req, res, next) => [req.params, req.body]));

router.delete('/:config_id', celebrate(schema.deleteConfig, schema.options), c(controller.deleteConfig, (req, res, next) => [req.params]));

module.exports = router;