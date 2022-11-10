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
                        sku: 1,
                        brand: 1,
                        description: 1,
                        ageRange: 1,
                        length: 1,
                        color: 1,
                        weight: 1,
                        height: 1,
                        width: 1,
                        installation: 1,
                        battery: 1,
                        youtubeLink: 1,
                        description: 1,
                        value: 1,
                        offerPrice: 1,
                        price: 1,
                        image: 1,
                        status: 1,
                        category: 1,
                        gstPercent: 1,
                        stockCount: 1,
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
                wishedId: '$_id',
                _id: '$productDetail._id',
                name: '$productDetail.name',
                sku: '$productDetail.sku',
                brand: '$productDetail.brand',
                description: '$productDetail.description',
                ageRange: '$productDetail.ageRange',
                length: '$productDetail.length',
                color: '$productDetail.color',
                weight: '$productDetail.weight',
                height: '$productDetail.height',
                width: '$productDetail.width',
                installation: '$productDetail.installation',
                battery: '$productDetail.battery',
                youtubeLink: '$productDetail.youtubeLink',
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