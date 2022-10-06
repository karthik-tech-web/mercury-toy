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
                        categoryId: '$categoryId',
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', '$$categoryId'],
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
                    as: 'category',
                },
            },
            { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
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
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: { $cond: ['$image', '$image', null] },
                    price: 1,
                    foodType: 1,
                    availableType: 1,
                    status: 1,
                    categoryId: 1,
                    subCategoryId: 1,
                    includeGst: 1,
                    enable: 1,
                    categoryName: { $cond: ['$category.name', '$category.name', 'NA'] },
                    categoryValue: { $cond: ['$category.value', '$category.value', 'NA'] },
                    categoryStatus: { $cond: ['$category.status', '$category.status', 0] },
                    categoryEnable: { $cond: ['$category.enable', '$category.enable', false] },
                    cartCount: { $cond: [{ $arrayElemAt: ['$cart.itemCount', 0] }, { $arrayElemAt: ['$cart.itemCount', 0] }, 0] },
                },

            },
            {
                $sort: params.sortCondition,
            },
            // {
            //     $facet: {
            //         paginatedResults: [{
            //             $skip: params.skipCondition,
            //         }, {
            //             $limit: params.limitCondition,
            //         }],
            //         totalCount: [{
            //             $count: 'count',
            //         }],
            //     },
            // },
        ],
    );
    return list;
};

module.exports = {
    listService,
};