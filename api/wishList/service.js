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
            $project: {
                _id: 1,
                productId: '$productDetail._id',
                productName: '$productDetail.name',
                description: '$productDetail.description',
                value: '$productDetail.value',
                offerPrice: '$productDetail.offerPrice',
                price: '$productDetail.price',
                image: '$productDetail.image',
                status: '$productDetail.status',
                category: '$productDetail.category',
                gstPercent: '$productDetail.gstPercent',
                isWishListed: true,
                createdAt: '$createdAt',
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