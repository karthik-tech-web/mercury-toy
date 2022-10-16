// const moment = require('moment');
const mongoose = require('mongoose');
const index = require('./index');

const {
    ObjectId,
} = mongoose.Types;

const listService = async (params) => {
    const Model = await index.getModel();
    const list = await Model.aggregate(
        [
            {
                $match: params.matchCondition,
            },
            {
                $lookup: {
                    from: 'categories',
                    let: {
                        categoryId: '$category',
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ['$_id', '$$categoryId'],
                                },
                            },
                        },
                        {
                            $project:
                            {
                                name: 1,
                                value: 1,
                                status: 1,
                                enable: 1,
                            },
                        },
                    ],
                    as: 'categoryList',
                },
            },
            {
                $lookup: {
                    from: 'carts',
                    let: {
                        productId: '$_id',
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$productId', '$$productId'] },
                                        { $eq: ['$userId', params.loginUserId] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'cart',
                },
            },
            {
                $lookup: {
                    from: 'wishList',
                    let: {
                        productId: '$_id',
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$productId', '$$productId'] },
                                        { $eq: ['$userId', params.loginUserId] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'wishList',
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: { $cond: ['$image', '$image', null] },
                    price: { $cond: ['$price', '$price', 0] },
                    offerPrice: { $cond: ['$offerPrice', '$offerPrice', 0] },
                    status: 1,
                    category: 1,
                    gstPercent: 1,
                    categoryList: 1,
                    cartCount: { $cond: [{ $arrayElemAt: ['$cart.itemCount', 0] }, { $arrayElemAt: ['$cart.itemCount', 0] }, 0] },
                    isWishListed: { $cond: [{ $arrayElemAt: ['$wishList._id', 0] }, true, false] },
                    stockCount: { $cond: ['$stockCount', '$stockCount', 0] },
                },

            },
            {
                $sort: params.sortCondition,
            },
            {
                $facet: {
                    paginatedResults: [{
                        $skip: params.skipCondition,
                    }, {
                        $limit: params.limitCondition,
                    }],
                    totalCount: [{
                        $count: 'count',
                    }],
                },
            },
        ],
    );
    return list;
};

module.exports = {
    listService,
};