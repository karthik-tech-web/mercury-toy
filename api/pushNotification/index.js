const { Schema } = require('mongoose');
const { dbConn } = require('../../system/db/mongo');

const testSchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        auto: true,
    },
    reqData: Array,
}, {
    timestamps: true,
});

const getModel = async() => dbConn.model('test', testSchema);

module.exports = { getModel };