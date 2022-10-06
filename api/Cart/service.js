const index = require('./index');

const getCartDetails = async (params) => {
    const Model = await index.getModel();
    const list = await Model.aggregate(
        [{
                $match: params,
            },
            {
                $lookup: {
                    from: 'items',
                    let: {
                        postId: '$productId',
                    },
                    pipeline: [{
                            $match: {
                                $expr: {
                                    $eq: ['$_id', '$$postId'],
                                },
                            },
                        },
                        // {
                        //     $project: {
                        //         _id: 1,
                        //         title: 1,
                        //         imageUrl: 1,
                        //         price: 1,
                        //         description: 1,
                        //         postType: 1,
                        //     },
                        // },
                    ],
                    as: 'productDetails',
                },
            },
            {
                $unwind: {
                    path: '$productDetails',
                    preserveNullAndEmptyArrays: true,
                },
            },
            // {
            //     $project: {
            //         _id: 1,
            //         userId: 1,
            //         productId: 1,
            //         itemCount: 1,
            //         itemTitle: '$postDetails.title',
            //         itemImageUrl: '$postDetails.imageUrl',
            //         itemPrice: '$postDetails.price',
            //         itemDescription: '$postDetails.description',
            //         itemPostType: '$postDetails.postType',
            //     },
            // },
        ],
    );
    return list;
};

const getCartDetailsByUserId = async (params) => {
    const Model = await index.getModel();
    const list = await Model.aggregate(
        [{
                $match: params,
            },
            {
                $project: {
                    _id: 1,
                    productId: 1,
                    userId: 1,
                    itemCount: 1,
                    createdAt: 1,
                },
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
                                price: 1,
                                image: { $cond: ['$image', '$image', null] },
                                enable: 1,
                            },
                        },
                    ],
                    as: 'productDetails',
                },
            },
            {
                $unwind: {
                    path: '$productDetails',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    productId: 1,
                    userId: 1,
                    itemCount: 1,
                    createdAt: 1,
                    productName: '$productDetails.name',
                    productImage: '$productDetails.image',
                    productDescription: '$productDetails.description',
                    productPrice: '$productDetails.price',
                    productEnable: '$productDetails.enable',
                },
            },
        ],
    );
    return list;
};

module.exports = {
    getCartDetails,
    getCartDetailsByUserId,
};