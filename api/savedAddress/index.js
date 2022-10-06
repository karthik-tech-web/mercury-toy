const { Schema } = require('mongoose');
const { dbConn } = require('../../system/db/mongo');

const collecionSchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        auto: true,
    },
    geoLocation: String,
    address1: String,
    address2: String,
    landMark: String,
    addressType: Number, // 1.Home 2.Work 3.Friends or Family 4.others
    receiverName: String,
    receiverPhoneNo: String,
    otherUserName: String,
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

const getModel = async() => dbConn.models.savedAddress || dbConn.model('savedAddress', collecionSchema);

module.exports = {
    getModel,
};