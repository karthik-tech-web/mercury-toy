const {
    Schema,
} = require('mongoose');
const {
    dbConn,
} = require('../../system/db/mongo');

const configSchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        auto: true,
    },
    key: {
        type: String,
        required: true,
    },
    value: {
        type: Schema.Types.Mixed,
        required: true,
    },
    external: {
        type: Boolean,
        required: true,
    },
    status: {
        type: Number,
    },
}, {
    timestamps: true,
});

const getModel = async() => dbConn.model('config', configSchema, 'configs');

module.exports = { getModel };