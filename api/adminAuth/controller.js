const boom = require('@hapi/boom');
const path = require('path');
const moment = require('moment');
// const crypto = require('crypto');
// const bcrypt = require('bcrypt');
// const isEmpty = require('lodash.isempty');
const firebaseApi = require('../../system/lib/firebase/index');
// const userService = require('../User/service');
const dbService = require('../../system/db/dbService');
const stringConfig = require('../../system/utils/config');
const jwtAuth = require('../../system/utils/jwt-auth');

const signIn = async (userMeta) => {
    const firebaseUser = await firebaseApi.getUser(userMeta.user_id);
    if (firebaseUser.uid === undefined) {
        throw boom.notFound('User not Found');
    }
    let createUser = null;
    const result = {
        status: 200,
        message: 'User LoggedIn Successfully',
    };
    const addUser = {
        firebaseUid: firebaseUser.uid,
        phoneNumber: firebaseUser.phoneNumber,
        email: firebaseUser.email ? firebaseUser.email : null,
        emailVerified: firebaseUser.emailVerified,
        status: 1,
        lastLogin: new Date(),
        $inc: {
            loginCount: 1,
        },
        online: true,
    };
    const checkExistParams = {
        firebaseUid: firebaseUser.uid,
    };

    createUser = await dbService.updateOneService('adminUser', checkExistParams, addUser);
    if (!createUser._id) {
        throw boom.badRequest('Something went wrong. Please try again.');
    }
    // return createUser;
    result.details = [createUser];
    return result;
};

const logout = async (params) => {
    const updateParams = {
        online: false,
    };
    const updateCondtion = {
        firebaseUid: params.firebaseId,
    };
    const user = await dbService.checkExists('adminUser', updateCondtion);
    if (!user || !user._id) {
        throw boom.notFound('User not Found.');
    }
    if (user && user.online !== true) {
        throw boom.badRequest('User is not Logged In.');
    }
    const updateUser = await dbService.updateOneService('adminUser', updateCondtion, updateParams);
    const result = {
        status: 200,
        message: 'Logout successfully',
        details: [updateUser],
    };
    return result;
};


module.exports = {
    signIn,
    logout,
};