const admin = require('firebase-admin');
const firebase = require('firebase/app');
const firebaseAuth = require('firebase/auth');
const boom = require('@hapi/boom');
const jwtAuth = require('../../utils/jwt-auth');
const stringConfig = require('../../utils/config');

const adminServiceAccount = require(`../../../${process.env.FIREBASE_ADMIN_SERVICE}`);
const userServiceAccount = require(`../../../${process.env.FIREBASE_USER_SERVICE}`);

const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(adminServiceAccount),
    // databaseURL: process.env.FIREBASE_DATABASE_URL,
}, adminServiceAccount.private_key_id);

const firebaseUser = admin.initializeApp({
    credential: admin.credential.cert(userServiceAccount),
    // databaseURL: process.env.FIREBASE_DATABASE_URL,
}, userServiceAccount.private_key_id);

const firebaseFunction = (tenantId = null) => {
    const firebase = (tenantId === 'admin') ? firebaseAdmin : firebaseUser;
    return firebase;
};

const actionCodeSettings = {
    url: process.env.FIREBASE_EMAIL_REDIRECT_LINK,
};

const createUser = async (user) => {
    console.log('Creating User in firebase');
    try {
        const firebase = firebaseFunction();
        const newUser = await firebase.auth().createUser({
            email: user.email,
            password: user.password,
            displayName: user.email,
            emailVerified: user.emailVerified,
        });
        console.log(`Firebase user created: ${newUser.uid}, email: ${user.email}`);
        return {
            uid: newUser.uid,
        };
    } catch (error) {
        return error.errorInfo.message;
    }
};

const generateEmailVerificationLink = async (email, verifyUrl = null) => {
    try {
        actionCodeSettings.url = verifyUrl || actionCodeSettings.url;
        const firebase = firebaseFunction();
        const verificationEmailLink = await firebase.auth().generateEmailVerificationLink(email, actionCodeSettings);
        return verificationEmailLink;
    } catch (error) {
        // To-do:handle this error
        return error.errorInfo;
    }
};

const verifyIdToken = async (req, res, next) => {
    const firebase = firebaseFunction(req.query.tenantId);
    if (!req.headers.authorization) {
        return next(boom.unauthorized());
    }
    const token = req.headers.authorization;
    if (req.headers.authorization === 'auth') {
        return next();
    }
    if (req.headers.authorization === 'jwt-verify') {
        if (!req.headers['jwt-token']) {
            return next(boom.unauthorized('Unauthorized Forget Password Token'));
        }
        const jwtVerify = await jwtAuth.tokenVerify(req.headers['jwt-token'], stringConfig.jwtResetPasswdSecretSalt);
        req.userMeta = jwtVerify.payload;
        return next();
    }
    const idToken = token.split(' ').pop();
    firebase.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
            req.userMeta = decodedToken;
            return next();
        }).catch((error) => {
            console.log('===========error======>', error);
            if (error.errorInfo && error.errorInfo.code) {
                if (error.errorInfo.code.indexOf('token-expired') !== -1) {
                    next(boom.gatewayTimeout('Token Expired.'));
                }
                next(boom.badRequest(error.errorInfo.message));
            }
            next(boom.unauthorized());
        });
};

const deleteUser = async (tenantId, uid) => {
    try {
        const firebase = firebaseFunction(tenantId);
        await firebase.auth().deleteUser(uid);
        return 'Successfully deleted user';
    } catch (error) {
        return error.errorInfo.message;
    }
};

const resetUserPassword = async (tenantId, uid, newPassword) => {
    try {
        const firebase = firebaseFunction(tenantId);
        const updateUser = await firebase.auth().updateUser(uid, {
            password: newPassword,
            emailVerified: true,
        });
        return {
            uid: updateUser.uid,
        };
    } catch (error) {
        return error.errorInfo.message;
    }
};

const getUser = async (uid) => {
    try {
        const firebase = firebaseFunction();
        const userDetail = await firebase.auth().getUser(uid);
        return userDetail;
    } catch (error) {
        return error.errorInfo.message;
    }
};

const pushNotification = async (userToken, payload, option = {}) => new Promise((resolve) => {
    try {
        // Send Notifiction
        const firebase = firebaseFunction();
        firebase.messaging().sendToDevice(userToken, payload, option).then((response) => {
            console.log('Successfully send message=>', JSON.stringify(response));
            resolve(response);
        }).catch((error) => {
            console.log(`Error sending message: ${error}`);
        });
    } catch (err) {
        console.log('Error message', err);
    }
});

module.exports = {
    createUser,
    generateEmailVerificationLink,
    verifyIdToken,
    deleteUser,
    resetUserPassword,
    getUser,
    pushNotification,
};