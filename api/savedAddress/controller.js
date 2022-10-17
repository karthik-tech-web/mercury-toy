/* eslint-disable no-restricted-syntax */
const boom = require('@hapi/boom');
const mongoose = require('mongoose');
const dbService = require('../../system/db/dbService');
const service = require('./service');

const { ObjectId } = mongoose.Types;

const isArray = (a) => (!!a) && (a.constructor === Array);

const checkExistFunction = async (checkExistParams) => {
    const checkParams = { ...checkExistParams };
    delete checkParams?.address2;
    delete checkParams?.phoneNo;
    delete checkParams?.alternatePhn;
    delete checkParams?.addressType;
    delete checkParams?.landMark;
    delete checkParams?.defaultAddress;
    const checkList = await dbService.listService('savedAddress', checkExistParams);
    if (checkList && checkList.length > 0) {
        throw boom.badRequest('Address Already Exist.');
    }
};

const updatedefaultAddress = async (params) => {
    const removeCond = {
        userId: params.userId,
        defaultAddress: true,
        _id: {
            $ne: params._id,
        },
    };
    const removeUpdateParams = {
        defaultAddress: false,
    };
    await dbService.updateManyService('savedAddress', removeCond, removeUpdateParams);
};

const add = async (params) => {
    await checkExistFunction(params);
    const details = await dbService.addService('savedAddress', params);
    if (!details || (add && !details._id)) {
        throw boom.badRequest('Something went wrong. Please try again.');
    }
    if (details.defaultAddress === true) {
        await updatedefaultAddress(details);
    }
    const result = {
        status: 200,
        message: 'Address saved Successfully',
        details: [details],
    };
    return result;
};

const facatParams = (pathParams, queryParams) => {
    const matchCond1 = {
        userId: ObjectId(pathParams.userId.toString()),
    };
    const sortCond = {
        createdAt: -1,
    };
    // const skipCond = params.offset * params.limit;
    const facetParams = {
        matchCondition1: matchCond1,
        sortCondition: sortCond,
    };
    if (queryParams.limit) {
        facetParams.skipCondition = queryParams.offset * queryParams.limit;
        facetParams.limitCondition = queryParams.limit;
    }
    return facetParams;
};

const list = async (pathParams, queryParams) => {
    const facatDetails = facatParams(pathParams, queryParams);
    const details = await service.listService(facatDetails);
    if (isArray(details) !== true || details.length === 0) {
        throw boom.notFound('No Saved Address Found');
    }
    if (isArray(details[0].paginatedResults) !== true || details[0].paginatedResults.length === 0) {
        throw boom.notFound('No Saved Address Found.');
    }
    const result = {
        status: 200,
        message: 'Saved Address List',
        detail: details,
    };
    return result;
};

const getAddress = async (params) => {
    const getParams = {
        _id: params.addressId,
    };
    const detail = await dbService.listService('savedAddress', getParams);
    if (!detail) {
        throw boom.notFound('No Saved Address Found');
    }
    const result = {
        status: 200,
        message: 'Saved Address Details',
        detail: [detail],
    };
    return result;
};

const update = async (pathParams, bodyParams) => {
    const getParams = {
        _id: Object(pathParams.addressId.toString()),
    };
    const details = await dbService.checkExists('savedAddress', getParams);
    if (!details || !details._id) {
        throw boom.notFound('Invalid addressId');
    }
    const detail = await dbService.updateOneService('savedAddress', getParams, bodyParams);
    if ((bodyParams.defaultAddress || bodyParams.defaultAddress === false) && bodyParams.defaultAddress !== details.defaultAddress) {
        await updatedefaultAddress(detail);
    }
    const result = {
        status: 200,
        message: 'Address updated Successfully',
        detail: [detail],
    };
    return result;
};

const deleteRecord = async (params) => {
    const deleteParams = {
        _id: params.addressId,
    };
    const deleteCnt = await dbService.deleteService('savedAddress', deleteParams);
    if (deleteCnt.acknowledged !== true) {
        throw boom.badRequest('Something went wrong. Please try again.');
    }
    const result = {
        status: 200,
        message: 'Address Deleted Successfully',
    };
    return result;
};

module.exports = {
    add,
    list,
    getAddress,
    update,
    deleteRecord,
};