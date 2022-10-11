const { Schema } = require('mongoose');
const { dbConn } = require('../../system/db/mongo');

const collectionSchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        auto: true,
    },
    name: String,
    description: String,
    value: String,
    offerPrice: Number,
    price: Number,
    image: {
        type: Array,
        default: null,
    },
    status: {
        type: Number,
        default: 1, //1.active 2.inactive 3.out of stock
    },
    category: {
        type: [Schema.Types.ObjectId],
        ref: 'category',
        default: null,
    },
    stockCount: {
        type: Number,
        default: 1,
    },
    gstPercent: {
        type: Number,
        default: 18,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
}, {
    timestamps: true,
});

const getModel = async () => dbConn.model('item', collectionSchema, 'items');

module.exports = { getModel };