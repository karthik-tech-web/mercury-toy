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
                    orderDate: 1,
                    orderProcessed: 1,
                    productStatus: 1,
                    paymentMethod: 1,
                    address: 1,
                    orderId: 1,
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

// const purchaseList = async(matchCondition) => {
//     const Model = await index.getModel();
//     const list = await Model.aggregate(
//         [
//             {
//                 $match: matchCondition,
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     productList: 1,
//                     // currency: 1,
//                     // actualAmount: 1,
//                     // orderAmount: 1,
//                     userId: 1,
//                     // orderProcessed: 1,
//                 },
//             },
//             {
//                 $lookup: {
//                     from: 'posts',
//                     let: {
//                         orderId: '$_id',
//                         userId: '$userId',
//                         postIdArray: '$productList',
//                     },
//                     pipeline: [
//                         {
//                             $match: {
//                                 $expr: {
//                                     $and: [
//                                         {
//                                             $in: ['$_id', '$$postIdArray'],
//                                         },
//                                         // {
//                                         //     $eq: ['$postType', params.postType],
//                                         // },
//                                     ],
//                                 },
//                             },
//                         },
//                         {
//                             $lookup: {
//                                 from: 'orderproducts',
//                                 let: {
//                                     orderId: '$$orderId',
//                                     userId: '$$userId',
//                                     productId: '$_id',
//                                 },
//                                 pipeline: [
//                                     {
//                                         $match: {
//                                             $expr: {
//                                                 $and: [
//                                                     {
//                                                         $eq: ['$orderId', '$$orderId'],
//                                                     },
//                                                     {
//                                                         $eq: ['$userId', '$$userId'],
//                                                     },
//                                                     {
//                                                         $eq: ['$productId', '$$productId'],
//                                                     },
//                                                 ],
//                                             },
//                                         },
//                                     },
//                                     {
//                                         $project: {
//                                             _id: 1,
//                                             // discountType: 1,
//                                             // discountCode: 1,
//                                             // discountRate: 1,
//                                             currency: 1,
//                                             actualAmount: 1,
//                                             orderAmount: 1,
//                                             userIp: 1,
//                                             orderDate: 1,
//                                             orderStatus: 1,
//                                         },
//                                     },
//                                 ],
//                                 as: 'orderProduct',
//                             },
//                         },
//                         {
//                             $unwind: {
//                                 path: '$orderProduct',
//                                 preserveNullAndEmptyArrays: true,
//                             },
//                         },
//                         {
//                             $project: {
//                                 _id: 1,
//                                 postType: 1,
//                                 // imageUrl: 1,
//                                 title: 1,
//                                 price: '$price',
//                                 orderId: '$$orderId',
//                                 productTitle: {
//                                     $cond: ['$title', '$title', null],
//                                 },
//                                 productType: {
//                                     $cond: ['$postType', '$postType', null],
//                                 },
//                                 imageUrl: {
//                                     $cond: ['$imageUrl', '$imageUrl', null],
//                                 },
//                                 // orderProduct: 1,
//                                 orderCurrency: {
//                                     $cond: ['$orderProduct.currency', '$orderProduct.currency', null],
//                                 },
//                                 orderAmount: {
//                                     $cond: ['$orderProduct.orderAmount', '$orderProduct.orderAmount', 0],
//                                 },
//                                 orderDate: {
//                                     $cond: ['$orderProduct.orderDate', '$orderProduct.orderDate', null],
//                                 },
//                                 orderStatus: {
//                                     $cond: ['$orderProduct.orderStatus', '$orderProduct.orderStatus', 0],
//                                 },
//                             },
//                         },
//                     ],
//                     as: 'productDetails',
//                 },
//             },
//             {
//                 $unwind: {
//                     path: '$productDetails',
//                     preserveNullAndEmptyArrays: true,
//                 },
//             },
//             {
//                 $replaceRoot: {
//                     newRoot: {
//                         $ifNull: ['$productDetails', {}],
//                     },
//                 },
//             },
//             // {
//             //     $sort: params.sortCondition,
//             // },
//             // {
//             //     $facet: {
//             //         paginatedResults: [{
//             //             $skip: params.skipCondition,
//             //         }, {
//             //             $limit: params.limitCondition,
//             //         }],
//             //         totalCount: [{
//             //             $count: 'count',
//             //         }],
//             //     },
//             // },
//         ],
//     );
//     return list;
// };

module.exports = {
    listService,
    // purchaseList,
};
