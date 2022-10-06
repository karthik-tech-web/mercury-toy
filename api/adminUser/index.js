const { Schema } = require('mongoose');
const { dbConn } = require('../../system/db/mongo');
const config = require('../../system/utils/config');

const userSchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        auto: true,
    },
    firebaseUid: {
        type: String,
        unique: true,
    },
    displayName: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        // unique: true,
        // required: true,
        default: null,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    countryCode: String,
    phoneNumber: String,
    // photoUrl: {
    //     type: String,
    //     default: null,
    // },
    status: {
        type: Number,
        default: 0,
    },
    online: {
        type: Boolean,
        default: false,
    },
    loginCount: {
        type: Number,
    },
    lastLogin: Date,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'adminUser',
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'adminUser',
    },
}, {
    timestamps: true,
});

const getModel = async () => dbConn.model('adminUser', userSchema, 'adminUsers');

module.exports = { getModel };