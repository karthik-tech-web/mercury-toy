const mongoose = require('mongoose');
const index = require('./index');

const { ObjectId } = mongoose.Types;

const wishListByUser = async (params) => {
    const Model = await index.getModel();
    const result = await Model.aggregate(
        [{
            $match: params.matchCondition,
        },
        {
            $lookup: {
                from: 'items',
                let: {
                    productId: '$productId',
                },
                pipeline: [{
                    $match: {
                        $expr: {
                            $eq: ['$_id', '$$productId'],
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        description: 1,
                        value: 1,
                        offerPrice: 1,
                        price: 1,
                        image: 1,
                        status: 1,
                        category: 1,
                        gstPercent: 1,
                    },
                },
                ],
                as: 'productDetail',
            },
        },
        { $unwind: { path: '$productDetail', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'categories',
                let: {
                    categoryId: '$productDetail.category',
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
                    productId: '$productDetail._id',
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
            $project: {
                // productDetail: 1,
                wishedId: '$_id',
                _id: '$productDetail._id',
                name: '$productDetail.name',
                description: '$productDetail.description',
                offerPrice: '$productDetail.offerPrice',
                price: '$productDetail.price',
                image: '$productDetail.image',
                status: '$productDetail.status',
                category: '$productDetail.category',
                stockCount: { $cond: ['$productDetail.stockCount', '$productDetail.stockCount', 0] },
                gstPercent: '$productDetail.gstPercent',
                isWishListed: true,
                createdAt: 1,
                cartCount: { $cond: [{ $arrayElemAt: ['$cart.itemCount', 0] }, { $arrayElemAt: ['$cart.itemCount', 0] }, 0] },
                categoryList: 1,
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
    return result;
};

module.exports = {
    wishListByUser,
};