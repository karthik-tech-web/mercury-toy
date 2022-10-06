const index = require('./index');

const listService = async(params) => {
    const model = await index.getModel();
    const list = await model.aggregate(
        [{
            $match: params.matchCondition1,
        },
        {
            $project: {
                _id: 1,
                geoLocation: 1,
                address1: 1,
                address2: { $cond: ['$address2', '$address2', null]},
                landMark: { $cond: ['$landMark', '$landMark', null]},
                addressType: 1,
                receiverName: { $cond: ['$receiverName', '$receiverName', null]},
                receiverPhoneNo: { $cond: ['$receiverPhoneNo', '$receiverPhoneNo', null]},
                defaultAddress: true,
                createdAt: 1,
                userId: 1,
            },
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