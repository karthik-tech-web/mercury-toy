
const boom = require('@hapi/boom');
const mongoose = require('mongoose');
const isEmpty = require('lodash.isempty');
const dbService = require('../../system/db/dbService');
const utilsChecks = require('../../system/utils/checks');
const service = require('./service');

const { ObjectId } = mongoose.Types;

const add = async (params) => {
    const addRecord = await dbService.updateOneService('brands', params, params);
    if (!addRecord) {
        throw boom.badRequest('Something went wrong. Please try again.');
    }

    const result = {
        status: 200,
        message: 'Brand added Successfully',
        detail: [addRecord],
    };
    return result;
};

const remove = async (params) => {
    const deleteParams = {
        _id: params.brandId,
    };
    const brandDetails = await dbService.checkExists('brands', deleteParams);
    if (isEmpty(brandDetails) || !brandDetails) {
        throw boom.notFound('Invalid Brand Id');
    }
    const deleteRecord = await dbService.deleteService('brands', deleteParams);
    if (!deleteRecord) {
        throw boom.badRequest('Something went wrong. Please try again.');
    }
    const result = {
        status: 200,
        message: 'Brand removed successfully',
    };
    return result;
};

const getList = async () => {
    const list = await dbService.listService('brands', { status: 1 }, { name: 1, status: 1 });
    if (!utilsChecks.isArray(list) || list.length <= 0) {
        throw boom.notFound('No Brand Found');
    }
    const result = {
        status: 200,
        message: 'Brand List',
        detail: list,
    };
    return result;
};

module.exports = {
    add,
    remove,
    getList,
};