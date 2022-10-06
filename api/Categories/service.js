// const moment = require('moment');
const mongoose = require('mongoose');
const index = require('./index');

const {
    ObjectId,
} = mongoose.Types;

const listService = async (matchCondition) => {
    const Model = await index.getModel();
    const list = await Model.aggregate(
        [
            {
                $match: matchCondition,
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    value: 1,
                    enable: 1,
                    image: { $cond: ['$image', '$image', null] },
                    parentCategoryId: 1,
                    categoryType: 1,
                    status: 1,
                },

            },
        ],
    );
    return list;
};

module.exports = {
    listService,
};