const boom = require('@hapi/boom');
const mongoose = require('mongoose');
const isEmpty = require('lodash.isempty');
// const authenticator = require('authenticator');
// const { google } = require('googleapis');
const service = require('./service');
const dbService = require('../../system/db/dbService');
const firebaseApi = require('../../system/lib/firebase/index');
const stringConfig = require('../../system/utils/config');
const jwtAuth = require('../../system/utils/jwt-auth');
// const sendMail = require('../../system/sendmail/index');
// const configController = require('../Config/controller');
const utilsChecks = require('../../system/utils/checks'); 4

const { ObjectId } = mongoose.Types;

const getUserDetails = async (params) => {
    // const getParamsValue = { 1: '_id', 2: 'firebaseUid', 3: 'email' };
    const getParams = {};
    if (params.type === 1) {
        getParams._id = params.data;
    } else if (params.type === 2) {
        getParams.firebaseUid = params.data;
    }
    const detail = await dbService.checkExists('adminUser', getParams);
    if (!detail) {
        throw boom.notFound('No User Found');
    }
    const result = {
        status: 200,
        message: 'User Detail',
        detail: [detail],
    };
    return result;
};

const updateUser = async (pathParams, params = {}) => {
    if (params && Object.keys(params).length === 0) {
        throw boom.notFound('No Update Parameters are Found');
    }
    const getUserParams = {
        $or: [
            { _id: pathParams.userId },
            { phoneNumber: params.phoneNumber },
        ],
    };
    const user = await dbService.listService('adminUser', getUserParams);
    if (!utilsChecks.isArray(user) || user.length <= 0) {
        throw boom.notFound('User does not Exist');
    }
    const duplicatePhnNo = user.filter((x) => x.phoneNumber === params.phoneNumber && pathParams.userId !== x._id.toString());
    if (duplicatePhnNo.length > 0) {
        throw boom.badRequest('Phone Number Already Exist');
    }
    const updateDetails = await dbService.updateOneService('adminUser', getUserParams, params);
    const result = {
        status: 200,
        message: 'User updated Successfully',
        detail: [updateDetails],
    };
    return result;
};

module.exports = {
    getUserDetails,
    updateUser,
};