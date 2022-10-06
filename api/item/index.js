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
    foodType: Number, //1.veg 2.nonVeg 3.Egg
    image: {
        type: String,
        default: null,
    },
    availableType: Number, // 1.always available 2.available in selected time
    status: {
        type: Number,
        default: 1,
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        default: null,
    },
    subCategoryId: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        default: null,
    },
    includeGst: {
        type: Boolean,
        default: false,
    },
    enable: {
        type: Boolean,
        default: false,
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