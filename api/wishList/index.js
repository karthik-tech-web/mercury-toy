const { Schema } = require('mongoose');
const { dbConn } = require('../../system/db/mongo');

const dataSchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        auto: true,
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'item',
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
}, {
    timestamps: true,
});

const getModel = async () => dbConn.model('wishList', dataSchema, 'wishList');

module.exports = { getModel };