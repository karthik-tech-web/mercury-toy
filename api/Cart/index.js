const { Schema } = require('mongoose');
const { dbConn } = require('../../system/db/mongo');

const cartSchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        auto: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'item',
    },
    itemCount: {
        type: Number,
    },
}, {
    timestamps: true,
});

const getModel = async() => dbConn.models.cart || dbConn.model('cart', cartSchema, 'carts');

module.exports = { getModel };