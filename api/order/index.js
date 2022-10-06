const { Schema } = require('mongoose');
const { dbConn } = require('../../system/db/mongo');
const config = require('../../system/utils/config');

const orderSchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        auto: true,
    },
    // billingAddressId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'billingAddress',
    // },
    products: String,
    productsName: String,
    address: String,
    addressId: {
        type: Schema.Types.ObjectId,
        ref: 'savedaddresses',
    },
    // discountType: {
    //     type: String,
    //     default: null,
    // },
    // discountCode: {
    //     type: String,
    //     default: null,
    // },
    // discountRate: Number,
    actualAmount: Number,
    orderAmount: Number,
    paymentMethod : {
        type: String,
        enum: Object.keys(config.paymentMethodObj),
    },
    userIp: String,
    orderId: {
        type: String,
        unique: true,
    },
    orderDate: Date, // Success or Failure attempt date
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    foodStatus: {
        type: Number,
        default: 0, // 0.pending 1.New 2.Accepted 3.outOfDelivery 4.Delivered
    },
    orderProcessed: {
        type: Number,
        default: 0, // 0.pending 1.Success 2.Failure 3.Cancel 4.Refund
    },
    status: {
        type: Number,
        default: 1,
    },
}, {
    timestamps: true,
});

const getModel = async() => dbConn.models.order || dbConn.model('order', orderSchema);

module.exports = { getModel };