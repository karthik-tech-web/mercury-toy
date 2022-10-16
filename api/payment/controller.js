/* eslint-disable no-restricted-syntax */

const boom = require('@hapi/boom');
const mongoose = require('mongoose');
const isEmpty = require('lodash.isempty');
const dbService = require('../../system/db/dbService');
// const orderProductService = require('../orderProduct/service');
// const walletController = require('../wallet/controller');
// const utilsChecks = require('../../system/utils/checks');
// const service = require('./service');

const { ObjectId } = mongoose.Types;

const initiatePayment = async (params) => {
    try {
        const add = await dbService.addService('payment', params);
        if (!add) {
            throw boom.badRequest('Something went wrong. Please try again.');
        }
        const result = {
            status: 200,
            message: 'Payment Initiated Successfully',
            detail: add,
        };
        return result;
    } catch (err) {
        const errMsg = err || 'Something went wrong. Please try again.';
        throw boom.badRequest(errMsg);
    }
};

const removeProcessedCart = async (params) => {
    try {
        // const matchCondition = {
        //     // orderId: params.orderId,
        //     userId: params.userId,
        // };
        const deleteCondition = {
            userId: params.userId,
        };
        const clearCart = await dbService.deleteService('Cart', deleteCondition);
        if (clearCart.acknowledged === true) {
            console.log('Cart cleared Successfully');
        } else {
            console.log('Unable to remove cart', clearCart);
        }
    } catch (err) {
        console.log('remove cart Err', err);
    }
};

const updateProductStockCount = async (params) => {
    try {
        const productList = JSON.parse(params.productsName);
        for (const product of productList) {
            const updateStockCount = await dbService.updateOneService('item', { _id: product._id }, { $inc: { stockCount: -product.itemCount } });
            if (!updateStockCount || !updateStockCount._id) {
                console.log('Stock update went wrong.');
            }
        }
    } catch (err) {
        console.log('remove cart Err', err);
    }
};

const successPayment = async (params) => {
    try {
        const matchCondition = {
            orderId: params.orderId,
            userId: params.userId,
        };
        const paymentDetails = await dbService.checkExists('payment', matchCondition);
        if (isEmpty(paymentDetails) || !paymentDetails) {
            throw boom.notFound('Invalid OrderId');
        } else if (paymentDetails.paymentStatus > 0) {
            throw boom.badRequest('Payment already Processed');
        } else if (paymentDetails.userId.toString() !== params.userId) {
            throw boom.badRequest('Invalid UserId to process payment');
        }

        const paymentDate = new Date();
        const updateParams = {
            paymentDate,
            paymentStatus: 1,
            paymentMethod: 1,
        };
        const updateCondition = {
            _id: paymentDetails._id,
        };
        const update = await dbService.updateOneService('payment', updateCondition, updateParams);
        if (!update) {
            throw boom.badRequest('Something went wrong. Please try again.');
        }
        const updateOrderCondition = {
            orderId: paymentDetails.orderId,
        };
        const updateOrderParams = {
            orderProcessed: updateParams.paymentStatus,
            orderDate: paymentDate,
            productStatus: 1,
        };
        const updateOrder = await dbService.updateOneService('order', updateOrderCondition, updateOrderParams);
        if (!updateOrder) {
            throw boom.badRequest('Something went wrong. Please try again.');
        }
        await removeProcessedCart(params);
        if (updateParams.paymentStatus === 1) {
            await updateProductStockCount(updateOrder);
        }
        const result = {
            status: 200,
            message: 'Payment Received Successfully',
        };
        result.message = (updateOrderParams.orderProcessed !== 1) ? 'Payment Failed' : result.message;
        return result;
    } catch (err) {
        const errMsg = err || 'Something went wrong. Please try again.';
        throw boom.badRequest(errMsg);
    }
};

const paymentFailure = async (params) => {
    try {
        const matchCondition = {
            orderId: params.orderId,
            userId: params.userId,
        };
        const paymentDetails = await dbService.checkExists('payment', matchCondition);
        if (isEmpty(paymentDetails) || !paymentDetails) {
            throw boom.notFound('Invalid PaymentId');
        } else if (paymentDetails.paymentStatus > 0) {
            throw boom.badRequest('Payment already Processed');
        } else if (paymentDetails.userId.toString() !== params.userId) {
            throw boom.badRequest('Invalid UserId to process payment');
        }

        const paymentDate = new Date();
        const updateParams = {
            paymentDate,
            paymentStatus: 2,
            // paymentMethod: 5,
        };
        const updateCondition = {
            _id: paymentDetails._id,
        };
        const update = await dbService.updateOneService('payment', updateCondition, updateParams);
        if (!update) {
            throw boom.badRequest('Something went wrong. Please try again.');
        }
        const updateOrderCondition = {
            orderId: paymentDetails.orderId,
        };
        const updateOrderParams = {
            orderProcessed: updateParams.paymentStatus,
            orderDate: paymentDate,
        };
        const updateOrder = await dbService.updateOneService('order', updateOrderCondition, updateOrderParams);
        if (!updateOrder) {
            throw boom.badRequest('Something went wrong. Please try again.');
        }
        const result = {
            status: 200,
            message: 'Payment Received Successfully',
        };
        result.message = (updateParams.paymentStatus !== 1) ? 'Payment Failed' : result.message;
        return result;
    } catch (err) {
        const errMsg = err || 'Something went wrong. Please try again.';
        throw boom.badRequest(errMsg);
    }
};

module.exports = {
    initiatePayment,
    successPayment,
    paymentFailure,
};