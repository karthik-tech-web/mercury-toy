/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();
// const { celebrate } = require('celebrate');
const c = require('../../system/utils/controller-handler');
const controller = require('./controller');

router.post('/', c(controller.pushnotification, (req, res) => [req.body]));

module.exports = router;