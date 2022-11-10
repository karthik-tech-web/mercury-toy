const { Schema } = require('mongoose');
const { dbConn } = require('../../system/db/mongo');

const collectionSchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        auto: true,
    },
    name: String,
    status: {
        type: Number,
        default: 1,
    },
}, {
    timestamps: true,
});

const getModel = async () => dbConn.models.brand || dbConn.model('brand', collectionSchema, 'brands');

module.exports = { getModel };