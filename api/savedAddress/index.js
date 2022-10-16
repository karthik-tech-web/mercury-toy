const { Schema } = require('mongoose');
const { dbConn } = require('../../system/db/mongo');

const collecionSchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        auto: true,
    },
    fullName: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    pincode: String,
    phoneNo: String,
    alternatePhn: String,
    addressType: Number, // 1.Home 2.Work
    landMark: String,
    defaultAddress: {
        type: Boolean,
        default: false,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
}, {
    timestamps: true,
});

const getModel = async () => dbConn.models.savedAddress || dbConn.model('savedAddress', collecionSchema, 'savedAddresses');

module.exports = {
    getModel,
};