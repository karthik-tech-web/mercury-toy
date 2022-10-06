const {
    Schema,
} = require('mongoose');
const {
    dbConn,
} = require('../../system/db/mongo');

const categorySchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        auto: true,
    },
    name: String,
    value: String,
    status: {
        type: Number,
        default: 1,
    },
    enable: {
        type: Boolean,
        default: false,
    },
    parentCategoryId: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        default: null,
    },
    categoryType: {
        type: Number,
        default: 1,
    },
    image: {
        type: String,
        default: null,
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

const getModel = async () => dbConn.model('category', categorySchema, 'categories');

module.exports = { getModel };