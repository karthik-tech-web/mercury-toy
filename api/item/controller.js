const boom = require('@hapi/boom');
const isEmpty = require('lodash.isempty');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const service = require('./service');
const dbService = require('../../system/db/dbService');
const utilsChecks = require('../../system/utils/checks');

const arrayConvertor = (params, convertFields, splitValue) => {
    const paramsLength = Object.keys(params).length;
    const convertFieldLength = convertFields.length;
    if (paramsLength > 0 && convertFieldLength > 0) {
        for (const convertField of convertFields) {
            if (params[convertField]) {
                params[convertField] = params[convertField].split(splitValue);
                params[convertField] = [...new Set(params[convertField])];
            }
        }
    }
};

const addItem = async (fileParams, params) => {
    if (Object.keys(fileParams).length && fileParams.image && fileParams.image.length) {
        params.image = [];
        fileParams.image.map((x) => params.image.push(`item-uploads/${x.filename}`));
    }
    arrayConvertor(params, ['category', ',']);
    const add = await dbService.addService('item', params);
    if (!add) {
        throw boom.badRequest('Something went Wrong. Please Try again later.');
    }
    const result = {
        status: 200,
        message: 'Item added Successfully',
        details: [add],
    };
    return result;
};

const facadeFunction = (params) => {
    const matchCond = {
        status: 1,
    };
    if (params.available) {
        matchCond.stockCount = {
            $gte: 1,
        };
    }
    // matchCond.price = {};
    matchCond.price = {
        $gte: 0,
    };
    if (params.minPrice) {
        matchCond.price['$gte'] = params.minPrice;
    }
    if (params.maxPrice) {
        matchCond.price['$lte'] = params.maxPrice;
    }
    if (params.category) {
        arrayConvertor(params, ['category'], ',');
        matchCond.category = {
            $in: params.category,
        };
    }
    const sortCond = {};
    const { sortBy } = params;
    const { sortDir } = params;
    const sortArray = ['name', 'price', 'createdAt']; // array list to sort

    if (sortBy && sortArray.indexOf(sortBy) >= 0) {
        sortCond[sortBy] = (sortDir !== null && sortDir !== '' && sortDir === 'desc') ? -1 : 1;
    } else {
        sortCond.name = 1;
    }
    params.offset = params.offset ? params.offset : 0;
    params.limit = params.limit ? params.limit : 10;
    const facetParams = {
        matchCondition: matchCond,
        sortCondition: sortCond,
        loginUserId: dbService.ObjectId(params.userId.toString()),
        skipCondition: params.offset * params.limit,
        limitCondition: params.limit,
    };
    return facetParams;
};

const getItemList = async (params) => {
    const facatParams = facadeFunction(params);
    const list = await service.listService(facatParams);
    if (!utilsChecks.isArray(list) || list.length <= 0) {
        throw boom.notFound('No Item Found');
    }
    const result = {
        status: 200,
        message: 'Item List',
        detail: list,
    };
    return result;
};

const getItem = async (params) => {
    const getParams = {
        _id: params.itemId,
    };
    const detail = await dbService.checkExists('item', getParams);
    if (!detail) {
        throw boom.notFound('No Item Found');
    }
    const result = {
        status: 200,
        message: 'Item Details',
        detail: [detail],
    };
    return result;
};

const updateItem = async (pathParams, fileParams, bodyParams) => {
    const getParams = {
        _id: Object(pathParams.itemId.toString()),
    };
    // if (Object.keys(fileParams).length > 0 && fileParams.image.length > 0) {
    //     bodyParams.image = `item-uploads/${fileParams.image[0].filename}`;
    // }
    if (Object.keys(fileParams).length && fileParams.image && fileParams.image.length) {
        bodyParams.image = [];
        fileParams.image.map((x) => bodyParams.image.push(`item-uploads/${x.filename}`));
    }
    const itemDetail = await dbService.checkExists('item', getParams);
    if (isEmpty(itemDetail) || !itemDetail) {
        throw boom.notFound('Invalid Item');
    }
    const detail = await dbService.updateOneService('item', getParams, bodyParams);
    const result = {
        status: 200,
        message: 'Item updated Successfully',
        detail: [detail],
    };
    return result;
};

const deleteFiles = async (params, deleteField) => {
    const fileName = params[deleteField];
    const basePath = path.resolve(__dirname, '../..');
    const filePath = `${basePath}/${fileName}`;
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

const deleteItem = async (params) => {
    const deleteParams = {
        _id: Object(params.itemId.toString()),
    };
    const itemDetail = await dbService.checkExists('item', deleteParams);
    if (isEmpty(itemDetail) || !itemDetail) {
        throw boom.notFound('Invalid ItemId');
    }
    const detail = await dbService.deleteService('item', deleteParams);
    if (detail.acknowledged !== true) {
        throw boom.badRequest('Something Went Wrong. Please Try again later.');
    }
    if (itemDetail.image) {
        await deleteFiles(itemDetail, 'image');
    }
    const result = {
        status: 200,
        message: 'Item deleted successfully',
    };
    return result;
};

module.exports = {
    addItem,
    getItemList,
    getItem,
    updateItem,
    deleteItem,
};