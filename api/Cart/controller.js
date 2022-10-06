
const boom = require('@hapi/boom');
const mongoose = require('mongoose');
const isEmpty = require('lodash.isempty');
const dbService = require('../../system/db/dbService');
const utilsChecks = require('../../system/utils/checks');
const service = require('./service');

const { ObjectId } = mongoose.Types;

const cartValidation = async(params, cartArray) => {
    const getCartList = await dbService.listService('Cart', { userId: params.userId }, { _id: 1 });
    const maxCartCount = process.env.MAX_CART_COUNT || 10;
    if (!getCartList || getCartList.length >= maxCartCount) {
        const arrayLength = getCartList.length + cartArray.length;
        if (arrayLength >= maxCartCount) {
            throw boom.badRequest('Maximum 10 Item can be added to cart.');
        }
    }
};

const addCart = async(bodyParams) => {
    const productList = bodyParams.products.split('|');
    const cartArray = [];
    for (const product of productList) {
        let cartObj = {};
        const productData = product.split('~');
        productData[1] = parseInt(productData[1], 10);
        if ((!productData[1] && productData[1] !== 0) || productData[1] < 0) {
            throw boom.badRequest('Invalid Item Count.');
        } else {
            cartObj = {
                userId: bodyParams.userId,
                productId: productData[0],
                itemCount: productData[1], 
            };
            cartArray.push(cartObj);
        }
    }
    // const cartParams = {
    //     userId: bodyParams.userId,
    //     productId: bodyParams.productId,
    //     itemCount: bodyParams.itemCount,
    // };
    // return;
    const userId = await dbService.checkExists('User', { _id: ObjectId(bodyParams.userId.toString()) });
    if (isEmpty(userId) || !userId) {
        throw boom.notFound('Invalid user id');
    }
    await cartValidation(bodyParams, cartArray);
    const deleteArray = [];
    for(cart of cartArray) {
        const getParams = {
            ...cart,
        };
        delete getParams.itemCount;
        if (cart.itemCount === 0) {
            deleteArray.push(cart.productId);
        } else { 
        const add = await dbService.updateOneService('Cart', getParams, cart);
        if (!add) {
            throw boom.badRequest('Something went wrong. Please try again.');
        }
        }
    }
    if (deleteArray && Object.keys(deleteArray).length) { 
        const deleteCondition = {
            userId: bodyParams.userId,
            productId: {
                $in: deleteArray,
            },
        };
        const deleteCart = await dbService.deleteService('Cart', deleteCondition);
        if (!deleteCart.acknowledged) {
            throw boom.badRequest('Something went wrong. Please try again.');
        }
    }
    const result = {
        status: 200,
        message: 'Cart added Successfully',
        // detail: [add],
    };
    return result;
};

const removeCart = async(bodyParams) => {
    const cartParams = {
        _id: bodyParams.cartId,
    };
    const cartDetails = await dbService.checkExists('Cart', { _id: ObjectId(cartParams._id.toString()) });
    if (isEmpty(cartDetails) || !cartDetails) {
        throw boom.notFound('Invalid cart Id');
    }
    const remove = await dbService.deleteService('Cart', cartParams);
    if (!remove) {
        throw boom.badRequest('Something went wrong. Please try again.');
    }
    const result = {
        status: 200,
        message: 'Cart removed successfully',
    };
    return result;
};

const updateCart = async(pathParams, bodyParams) => {
    const updateParams = {
        itemCount: bodyParams.itemCount,
    };
    const updateId = { _id: ObjectId(pathParams.cartId.toString()) };
    const cartDetails = await dbService.checkExists('Cart', updateId);
    if (isEmpty(cartDetails) || !cartDetails) {
        throw boom.notFound('Invalid cart id');
    }
    if (updateParams.itemCount < 0) {
        throw boom.notFound('Please enter a valid item count');
    }
    if (updateParams.itemCount === 0) {
        removeCart(pathParams);
    }
    const remove = await dbService.updateOneService('Cart', updateId, updateParams);
    if (!remove) {
        throw boom.badRequest('Something went wrong. Please try again.');
    }
    const result = {
        status: 200,
        message: 'Cart Updated successfully',
        detail: [remove],
    };
    return result;
};

const getByIdCart = async(bodyParams) => {
    const cartParams = {
        _id: ObjectId(bodyParams.cartId.toString()),
    };
    const list = await service.getCartDetails(cartParams);
    if (!utilsChecks.isArray(list) || list.length <= 0) {
        throw boom.notFound('No Cart Found');
    }
    const result = {
        status: 200,
        message: 'Cart detail',
        detail: list,
    };
    return result;
};

const getByUserIdCart = async(bodyParams) => {
    const cartParams = {
        userId: ObjectId(bodyParams.userId.toString()),
    };
    const list = await service.getCartDetailsByUserId(cartParams);
    if (!utilsChecks.isArray(list) || list.length <= 0) {
        throw boom.notFound('No Cart Found');
    }
    const result = {
        status: 200,
        message: 'Cart List',
        detail: list,
    };
    return result;
};

module.exports = {
    addCart,
    removeCart,
    updateCart,
    getByIdCart,
    getByUserIdCart,
};