const boom = require('@hapi/boom');
const isEmpty = require('lodash.isempty');
const mongoose = require('mongoose');
const service = require('./service');
const dbService = require('../../system/db/dbService');
const utilsChecks = require('../../system/utils/checks');

const { ObjectId } = mongoose.Types;

const addCategory = async (params, fileParams) => {
    params.parentCategoryId = params.parentCategoryId ? params.parentCategoryId : null;
    // if (Object.keys(fileParams).length) {
    //     if (fileParams.image && fileParams.image.length) {
    //         params.image = [];
    //         fileParams.image.map((x) => params.image.push(x.path));
    //     }
    // }
    if (Object.keys(fileParams).length > 0 && fileParams.image.length > 0) {
        params.image = `item-uploads/${fileParams.image[0].filename}`;
    }
    const add = await dbService.addService('Categories', params);
    if (!add) {
        throw boom.badRequest('Something went Wrong. Please Try again later.');
    }
    const result = {
        status: 200,
        message: 'Category added Successfully',
        details: [add],
    };
    return result;
};

const getCategoryList = async (queryParams) => {
    const categoryType = (queryParams.type && queryParams.type === 2) ? 'Subcategory' : 'Category';
    let matchCondition = {};
    if (queryParams.type && (queryParams.type === 1 || queryParams.type === 2)) {
        matchCondition = {
            categoryType: queryParams.type,
        };
    }
    if (queryParams.enable || queryParams.enable === false) {
        matchCondition.enable = queryParams.enable;
    }
    if (queryParams.type && queryParams.type === 2 && queryParams.categoryId) {
        matchCondition.parentCategoryId = ObjectId(queryParams.categoryId.toString());
    }
    const list = await service.listService(matchCondition);
    if (!utilsChecks.isArray(list) || list.length <= 0) {
        throw boom.notFound(`No ${categoryType} Found`);
    }
    const result = {
        status: 200,
        message: `${categoryType} List`,
        detail: list,
    };
    return result;
};

const getCategory = async (params) => {
    const getParams = {
        _id: params.categoryId,
    };
    const detail = await dbService.listService('Categories', getParams);
    if (!detail) {
        throw boom.notFound('No Category Found');
    }
    const result = {
        status: 200,
        message: 'Category Details',
        detail: [detail],
    };
    return result;
};

const updateCategory = async (pathParams, bodyParams, fileParams) => {
    // if (Object.keys(fileParams).length) {
    //     if (fileParams.image && fileParams.image.length) {
    //         params.image = [];
    //         fileParams.image.map((x) => params.image.push(x.path));
    //     }
    // }
    if (Object.keys(fileParams).length > 0 && fileParams.image.length > 0) {
        bodyParams.image = `item-uploads/${fileParams.image[0].filename}`;
    }
    const getParams = {
        _id: Object(pathParams.categoryId.toString()),
    };
    const category = await dbService.checkExists('Categories', getParams);
    if (isEmpty(category) || !category) {
        throw boom.notFound('Invalid CategoryId');
    }
    const detail = await dbService.updateOneService('Categories', getParams, bodyParams);
    const result = {
        status: 200,
        message: 'Category updated Successfully',
        detail: [detail],
    };
    return result;
};

const deleteCategory = async (params) => {
    const deleteParams = {
        _id: Object(params.categoryId.toString()),
    };
    const category = await dbService.checkExists('Categories', deleteParams);
    if (isEmpty(category) || !category) {
        throw boom.notFound('Invalid CategoryId');
    }
    const detail1 = await dbService.deleteService('Categories', deleteParams);
    if (detail1.acknowledged !== true) {
        throw boom.badRequest('Something Went Wrong. Please Try again later.');
    }
    const deletesubCategoryParams = {
        parentCategoryId: Object(params.categoryId.toString()),
    };
    const detail2 = await dbService.deleteService('Categories', deletesubCategoryParams);
    if (detail2.acknowledged !== true) {
        throw boom.badRequest('Something Went Wrong. Please Try again later.');
    }
    const result = {
        status: 200,
        message: 'Category deleted successfully',
    };
    return result;
};

module.exports = {
    addCategory,
    getCategoryList,
    getCategory,
    updateCategory,
    deleteCategory,
};