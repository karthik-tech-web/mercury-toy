const { Schema } = require('mongoose');
const { dbConn } = require('../../system/db/mongo');

const collectionSchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        auto: true,
    },
    sku: {
        type: String,
        unique: true,
    },
    name: String,
    description: String,
    value: String,
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'brand',
        default: null,
    },
    ageRange: {
        type: Number,
        default: 1,
    },
    color: String,
    materialType: String,
    weight: {
        type: Number,
        default: 1,
    },
    height: {
        type: Number,
        default: 1,
    },
    width: {
        type: Number,
        default: 1,
    },
    installation: {
        type: Boolean,
        default: false,
    },
    battery: {
        type: Boolean,
        default: false,
    },
    youtubeLink: {
        type: String,
        default: null,
    },
    countryOforigin: String,
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