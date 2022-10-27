const index = require('./index');

const listService = async (params) => {
    const Model = await index.getModel();
    const list = await Model.aggregate(
        [
            {
                $match: params.matchCondition,
            },
            {
                $project: {
                    _id: 1,
                    products: 1,
                    productsName: 1,
                    actualAmount: 1,
                    orderAmount: 1,
                    deliveryCharge: 1,
                    gstAmount: 1,
                    totalAmount: 1,
                    orderDate: 1,
                    orderProcessed: 1,
                    productStatus: 1,
                    paymentMethod: 1,
                    address: 1,
                    orderId: 1,
                    createdAt: 1,
                },
            },
            // {
            //     $lookup: {
            //         from: 'posts',
            //         let: {
            //             postId: '$productId',
            //         },
            //         pipeline: [
            //             {
            //                 $match: {
            //                     $expr: {
            //                         $and: [
            //                             {
            //                                 $eq: ['$_id', '$$postId'],
            //                             },
            //                             {
            //                                 $eq: ['$postType', params.postType],
            //                             },
            //                         ],
            //                     },
            //                 },
            //             },
            //             {
            //                 $project: {
            //                     _id: 1,
            //                     postType: 1,
            //                     eventStartTime: 1,
            //                 },
            //             },
            //         ],
            //         as: 'productDetails',
            //     },
            // },
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
