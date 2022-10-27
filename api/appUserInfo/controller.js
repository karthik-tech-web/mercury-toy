const boom = require('@hapi/boom');
const mongoose = require('mongoose');
const isEmpty = require('lodash.isempty');
// const authenticator = require('authenticator');
// const { google } = require('googleapis');
// const service = require('./service');
const dbService = require('../../system/db/dbService');
// const firebaseApi = require('../../system/lib/firebase/index');
// const stringConfig = require('../../system/utils/config');
// const jwtAuth = require('../../system/utils/jwt-auth');
// const sendMail = require('../../system/sendmail/index');
// const configController = require('../Config/controller');
const utilsChecks = require('../../system/utils/checks'); 4

const { ObjectId } = mongoose.Types;

const getAppInfo = async (params) => {
    const getParams = {};
    const detail = await dbService.checkExists('appUserInfo', getParams);
    if (!detail) {
        throw boom.notFound('No Info Found');
    }
    const result = {
        status: 200,
        message: 'App User Info',
        detail: [detail],
    };
    return result;
};

const updateInfo = async (pathParams, fileParams = {}, params = {}) => {
    if (Object.keys(fileParams).length) {
        if (fileParams.photo && fileParams.photo[0] && fileParams.photo[0].path) {
            params.photoUrl = `profile-uploads/${fileParams.photo[0].filename}`;
        }
        if (fileParams.gallery && fileParams.gallery.length) {
            params.gallery = [];
            fileParams.gallery.map((x) => params.gallery.push(`profile-uploads/${x.filename}`));
        }
    }
    if (params && Object.keys(params).length === 0) {
        throw boom.notFound('No Update Parameters are Found');
    }
    const getParams = {
        _id: pathParams.infoId,
    };
    const appInfo = await dbService.checkExists('appUserInfo', getParams);
    if (!appInfo || !appInfo._id) {
        throw boom.notFound('AppInfo not Found');
    }

    const updateDetails = await dbService.updateOneService('appUserInfo', getParams, params);
    const result = {
        status: 200,
        message: 'AppUser Info Updated Successfully',
        detail: [updateDetails],
    };
    return result;
};

module.exports = {
    getAppInfo,
    updateInfo,
};