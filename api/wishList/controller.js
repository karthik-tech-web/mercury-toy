const boom = require('@hapi/boom');
const dbService = require('../../system/db/dbService');
const service = require('./service');
const utilsChecks = require('../../system/utils/checks');

const add = async (params) => {
    const insertParams = {
        productId: params.productId,
        userId: params.userId,
    };
    const wishDetails = await dbService.checkExists('wishList', insertParams);
    if (wishDetails && wishDetails._id) {
        throw boom.conflict('WishList Already Added.');
    }

    const add = await dbService.updateOneService('wishList', insertParams, insertParams);
    if (!add) {
        throw boom.badRequest('Something went wrong. Please try again.');
    }

    const result = {
        status: 200,
        message: 'WishList Added Successfully',
        detail: [add],
    };
    return result;
};

const facatFunction = (pathParams, queryParams) => {
    const matchCond1 = {
        userId: dbService.ObjectId(pathParams.userId.toString()),
    };
    const sortCond = {};
    const { sortBy } = queryParams;
    const { sortDir } = queryParams;
    const sortArray = ['productName', 'createdAt']; // array list to sort
    if (sortBy && sortArray.indexOf(sortBy) >= 0) {
        sortCond[sortBy] = (sortDir !== null && sortDir !== '' && sortDir === 'desc') ? -1 : 1;
    } else {
        sortCond.createdAt = -1;
    }
    queryParams.offset = queryParams.offset ? queryParams.offset : 0;
    queryParams.limit = queryParams.limit ? queryParams.limit : 10;
    const facetParams = {
        matchCondition: matchCond1,
        sortCondition: sortCond,
        skipCondition: queryParams.offset * queryParams.limit,
        limitCondition: queryParams.limit,
    };
    return facetParams;
};

const getWishListByUser = async (pathParams, queryParams) => {
    const facatParams = facatFunction(pathParams, queryParams);
    const list = await service.wishListByUser(facatParams);
    if (!utilsChecks.isArray(list) || list.length <= 0) {
        throw boom.notFound('No WishList found');
    }
    if (!utilsChecks.isArray(list[0].paginatedResults) || list[0].paginatedResults.length <= 0) {
        throw boom.notFound('No WishList found');
    }
    const result = {
        status: 200,
        message: 'Wish List',
        detail: list,
    };
    return result;
};

const remove = async (params) => {
    const getParams = {
        productId: params.productId,
        userId: params.userId,
    };
    const productDetails = await dbService.checkExists('wishList', getParams);
    if (!productDetails || !productDetails._id) {
        throw boom.notFound('Product is not added to wishList');
    }
    const details = await dbService.deleteService('wishList', getParams);
    if (!details) {
        throw boom.badRequest('Something went wrong. Please try again.');
    }
    const result = {
        status: 200,
        message: 'Product removed Successfully',
    };
    return result;
};

module.exports = {
    add,
    remove,
    getWishListByUser,
};