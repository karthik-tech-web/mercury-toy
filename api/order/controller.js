/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

const boom = require('@hapi/boom');
const mongoose = require('mongoose');
const isEmpty = require('lodash.isempty');
const dbService = require('../../system/db/dbService');
const utilsChecks = require('../../system/utils/checks');
const service = require('./service');
const payment = require('../payment/controller');
// const orderProductService = require('../orderProduct/service');

const { ObjectId } = mongoose.Types;

const offerCalculation = (params) => {
    const orderAmount = params.actualAmount * params.discountRate;
    return orderAmount;
};

const validateOrderParams = async (params) => {
    let totalActualAmount = 0;
    let totalOfferAmount = 0;
    params.gstAmount = 0;
    const orderDetails = {};
    const productList = params.products.split('|');
    let orderProductDetails = [];
    for (const data of productList) {
        const product = data.split('~');
        if (parseInt(product[1], 10) !== NaN) {
            product[1] = parseInt(product[1], 10);
        } else {
            boom.badRequest('Invalid productCount');
        }
        const productDetails = await dbService.checkExists('item', { _id: product[0] }, { name: 1, price: 1, status: 1, stockCount: 1, gstPercent: 1 });
        if (!productDetails || productDetails.status !== 1 || productDetails.stockCount < product[1]) {
            boom.badRequest('Remove Unavailable product to place Order');
        }
        const actualAmount = productDetails.price * product[1];
        const offerAmount = productDetails.price * product[1];
        const gstAmount = utilsChecks.percent(productDetails.price, productDetails.gstPercent);
        orderProductDetails.push({ _id: productDetails._id, name: productDetails.name, itemCount: product[1], actualAmount, offerAmount });
        totalActualAmount += actualAmount;
        totalOfferAmount += offerAmount;
        params.gstAmount += gstAmount;
    }
    orderDetails.productDetails = JSON.stringify(orderProductDetails);
    if (totalActualAmount !== params.actualAmount) {
        throw boom.badRequest('Invalid Actual Amount');
    } else if (totalOfferAmount !== params.orderAmount) {
        throw boom.badRequest('Invalid Order Amount');
    }
    return orderDetails;
};

const createOrder = async (bodyParams) => {
    try {
        const userDetails = await dbService.checkExists('User', { _id: bodyParams.userId });
        if (isEmpty(userDetails) || !userDetails) {
            throw boom.notFound('Invalid User Id');
        }
        bodyParams.orderDate = new Date();
        const validateOrder = await validateOrderParams(bodyParams);
        if (bodyParams.paymentGateway === 1 && bodyParams.orderId) {
            bodyParams.orderId = bodyParams.orderId;
        } else {
            bodyParams.orderId = `${bodyParams.userId}-${Date.now()}`;
        }
        const createOrderParams = {
            products: bodyParams.products,
            productsName: validateOrder.productDetails,
            actualAmount: bodyParams.actualAmount,
            orderAmount: bodyParams.orderAmount,
            userIp: bodyParams.userIp ? bodyParams.userIp : null,
            userId: bodyParams.userId,
            orderDate: bodyParams.orderDate,
            address: bodyParams.address,
            addressId: bodyParams.addressId,
            orderId: bodyParams.orderId,
            paymentMethod: bodyParams.paymentMethod,
            deliveryCharge: bodyParams.deliveryCharge,
            gstAmount: bodyParams.gstAmount,
            totalAmount: (bodyParams.orderAmount + bodyParams.gstAmount + bodyParams.deliveryCharge),
        };
        if (bodyParams.paymentMethod === 5) {
            createOrderParams.productStatus = 1;
            createOrderParams.orderProcessed = 1;
        }
        let create = await dbService.addService('order', createOrderParams);
        if (!create || !create._id) {
            throw boom.badRequest('Something went wrong. Please try again.');
        }
        create = JSON.parse(JSON.stringify(create));
        /** add payment Starts */
        const paymentParams = {
            paymentMethod: bodyParams.paymentMethod,
            paymentGateway: bodyParams.paymentGateway,
            paymentDate: bodyParams.orderDate,
            amount: createOrderParams.totalAmount,
            userIp: createOrderParams.userIp,
            userId: bodyParams.userId,
            orderId: bodyParams.orderId,
        };
        const addPayment = await payment.initiatePayment(paymentParams, userDetails);
        create.paymentId = (addPayment && addPayment.detail && addPayment.detail.id) ? addPayment.detail.id : null;
        /** add payment Ends */

        const result = {
            status: 200,
            message: 'Order Created Successfully',
            detail: create,
        };
        return result;
    } catch (err) {
        throw boom.badRequest(err);
    }
};

const facadeFunction = (params) => {
    params.orderStatus = params.orderStatus ? params.orderStatus : 1;
    const matchCondition = {
        orderProcessed: params.orderStatus,
    };
    if (params.userId) {
        matchCondition.userId = ObjectId(params.userId.toString());
    }
    if (params.productStatus) {
        matchCondition.productStatus = params.productStatus;
    }
    const sortCond = {};

    const { sortBy } = params;
    const { sortDir } = params;
    const sortArray = ['title', 'createdAt']; // array list to sort
    if (sortBy && sortArray.indexOf(sortBy) !== -1) {
        sortCond[sortBy] = (sortDir !== null && sortDir !== '' && sortDir === 'desc') ? -1 : 1;
    } else {
        sortCond.createdAt = -1;
    }
    params.offset = params.offset ? params.offset : 0;
    params.limit = params.limit ? params.limit : 10;
    // const skipCond = params.offset * params.limit;
    const facetParams = {
        matchCondition,
        sortCondition: sortCond,
        skipCondition: params.offset * params.limit,
        limitCondition: params.limit,
    };
    return facetParams;
};

const getOrderList = async (params) => {
    const facatParams = facadeFunction(params);
    const list = await service.listService(facatParams);
    if (!utilsChecks.isArray(list) || list.length <= 0) {
        throw boom.notFound('No Orders Found');
    }
    if (!utilsChecks.isArray(list[0].paginatedResults) || list[0].paginatedResults.length <= 0) {
        throw boom.notFound('No Orders Found');
    }
    const result = {
        status: 200,
        message: 'Order List',
        detail: list,
    };
    return result;
};

const productExist = async (params) => {
    try {
        const productDetails = await dbService.checkExists('posts', { _id: params.productId });
        if (isEmpty(productDetails) || !productDetails) {
            throw boom.notFound('Invalid Product Id');
        }
        const purchaseDetails = await purchaseValidation(productDetails);
        const result = {
            status: 200,
            details: [purchaseDetails],
        };
        return result;
    } catch (err) {
        throw boom.badRequest(err);
    }
};

const orderDetails = async (params) => {
    const matchCondtion = {
        _id: ObjectId(params.orderId.toString()),
    };
    const details = await dbService.checkExists('order', matchCondtion);
    if (!details || !details._id) {
        throw boom.notFound('Invalid OrderId');
    }
    const result = {
        status: 200,
        message: 'Order detail',
        detail: [details],
    };
    return result;
};

const updateOrder = async (params) => {
    try {
        const orderDetails = await dbService.checkExists('order', { _id: params.orderId });
        console.log('========orderDetails======>', orderDetails);
        if (isEmpty(orderDetails) || !orderDetails) {
            throw boom.notFound('Invalid Order');
        }
        if (orderDetails.orderProcessed !== 1) {
            throw boom.badRequest('Invalid Order to update Status');
        }
        const updateOrderParams = {};
        if (params.type === 1 && params.statusUpdate === 1) {
            updateOrderParams.orderProcessed = 3;
        } else if (params.type === 2) {
            if (params.statusUpdate < 2 || orderDetails.productStatus >= params.statusUpdate) {
                throw boom.badRequest('Invalid Food status Update');
            } else {
                updateOrderParams.productStatus = params.statusUpdate;
            }
        }
        await dbService.updateOneService('order', { _id: params.orderId }, updateOrderParams);
        if (params.type === 2 && params.statusUpdate === 4) {
            const updatePaymentParams = {
                paymentDate: new Date(),
                paymentStatus: 1,
            };
            await dbService.updateOneService('payment', { orderId: orderDetails.orderId }, updatePaymentParams);
        }
        const result = {
            status: 200,
            message: 'Order Status Successfully',
            // detail: create,
        };
        return result;
    } catch (err) {
        throw boom.badRequest(err);
    }
};

module.exports = {
    createOrder,
    getOrderList,
    orderDetails,
    productExist,
    updateOrder,
};