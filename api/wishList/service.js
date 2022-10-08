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
                    itemId: '$itemId',
                },
                pipeline: [{
                    $match: {
                        $expr: {
                            $eq: ['$_id', '$$itemId'],
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
                as: 'itemDetail',
            },
        },
        { $unwind: { path: '$itemDetail', preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: 1,
                postId: 1,
                itemName: '$itemDetail.name',
                description: '$itemDetail.description',
                value: '$itemDetail.value',
                offerPrice: '$itemDetail.offerPrice',
                price: '$itemDetail.price',
                image: '$itemDetail.image',
                status: '$itemDetail.status',
                category: '$itemDetail.category',
                gstPercent: '$itemDetail.gstPercent',
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