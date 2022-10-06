/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();
const {
    celebrate,
} = require('celebrate');
const c = require('../../system/utils/controller-handler');
const schema = require('./schema');
const controller = require('./controller');

router.post('/signIn', celebrate(schema.signIn, schema.options), c(controller.signIn, (req, res, next) => [req.userMeta]));

router.post('/logout/:firebaseId', celebrate(schema.logout, schema.options), c(controller.logout, (req, res, next) => [req.params]));

module.exports = router;