const boom = require('@hapi/boom');
const isEmpty = require('lodash.isempty');
// const service = require('./service');
const dbService = require('../../system/db/dbService');
const utilsChecks = require('../../system/utils/checks');

const addConfig = async(params) => {
    const add = await dbService.addService('Config', params);
    if (!add) {
        throw boom.badRequest('Something went Wrong. Please Try again later.');
    }
    const result = {
        status: 200,
        message: 'Config added Successfully',
        details: [add],
    };
    return result;
};

const getConfigList = async() => {
    const list = await dbService.listService('Config');
    if (!utilsChecks.isArray(list) || list.length <= 0) {
        throw boom.notFound('No Config Found');
    }
    const result = {
        status: 200,
        message: 'Config List',
        detail: list,
    };
    return result;
};

const getConfig = async(params) => {
    const getParams = {
        _id: params.config_id,
    };
    const detail = await dbService.checkExists('Config', getParams);
    if (!detail) {
        throw boom.notFound('No Config Found');
    }
    const result = {
        status: 200,
        message: 'Config Details',
        detail: [detail],
    };
    return result;
};

const updateConfig = async(pathParams, bodyParams) => {
    const getParams = {
        _id: Object(pathParams.config_id.toString()),
    };
    const Config = await dbService.checkExists('Config', getParams);
    if (isEmpty(Config) || !Config) {
        throw boom.notFound('Invalid ConfigId');
    }
    const detail = await dbService.updateService('Config', getParams, bodyParams);
    const result = {
        status: 200,
        message: 'Config updated Successfully',
        detail: [detail],
    };
    return result;
};

const deleteConfig = async(params) => {
    const deleteParams = {
        _id: Object(params.config_id.toString()),
    };
    const Config = await dbService.checkExists('Config', deleteParams);
    if (isEmpty(Config) || !Config) {
        throw boom.notFound('Invalid ConfigId');
    }
    const detail = await dbService.deleteService('Config', deleteParams);
    if (detail.acknowledged !== true) {
        throw boom.badRequest('Something Went Wrong. Please Try again later.');
    }
    const result = {
        status: 200,
        message: 'Config deleted successfully',
    };
    return result;
};

module.exports = {
    addConfig,
    getConfigList,
    getConfig,
    updateConfig,
    deleteConfig,
};