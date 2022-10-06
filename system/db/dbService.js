/* eslint-disable global-require */
/* eslint-disable brace-style */
/* eslint-disable camelcase */
// const moment = require('moment');
const mongoose = require('mongoose');
const boom = require('@hapi/boom');
const path = require('path');
const fs = require('fs');
const config = require('../utils/config');

const { ObjectId } = mongoose.Types;

/**
 *
 * @param {*} indexType will give input as index folder name
 * @returns return index
 */

const getCollectionIndex = (indexType) => {
    const basePath = path.resolve(__dirname, '../..');
    const indexPath = `${basePath}/api/${indexType}/index.js`;
    if (indexType && !fs.existsSync(indexPath)) {
        throw boom.badRequest('Invalid Index Type');
    }
    // eslint-disable-next-line import/no-dynamic-require
    return require(indexPath);
};

const checkExists = async (indexType, getCondition, projectparams = null) => {
    const index = getCollectionIndex(indexType);
    // const index = `${indexType}Index`;
    const Model = await index.getModel();
    const projectCondition = projectparams || '-__v';
    const CheckDataExists = await Model.findOne(getCondition, projectCondition);
    return CheckDataExists;
};

const addService = async (indexType, addParams) => {
    if (addParams.email) { addParams.email = addParams.email.trim().toLowerCase(); }
    const index = getCollectionIndex(indexType);
    const Model = await index.getModel();
    const newRecord = new Model(addParams);
    const saveRecord = await newRecord.save();
    return saveRecord;
};

const bulkCreateService = async (indexType, params) => {
    const option = {
        ordered: false,
    };
    const index = getCollectionIndex(indexType);
    const Model = await index.getModel();
    const result = await Model.insertMany(params, option);
    return result;
};

const listService = async (indexType, filterParams = null, projectparams = null, facatParams) => {
    const index = getCollectionIndex(indexType);
    const Model = await index.getModel();
    const filterCondtion = filterParams || { status: 1 };
    const skipCount = (facatParams && facatParams.skipCondition) ? facatParams.skipCondition : 0;
    const limitCount = (facatParams && facatParams.limitCondition) ? facatParams.limitCondition : 0;
    const projectCondition = projectparams || '-__v';
    const sortCondtion = (facatParams && facatParams.sortCondition) || { createdAt: 1 };
    const list = await Model.find(filterCondtion, projectCondition).sort(sortCondtion).skip(skipCount).limit(limitCount);
    return list;
};

const updateOneService = async (indexType, updateCondtion, updateParams, disableUpsert = false, projectParams = {}) => {
    const options = {
        new: true,
        upsert: true,
    };
    if (disableUpsert === true) {
        delete options.upsert;
    }
    if (updateParams.email) { updateParams.email = updateParams.email.trim().toLowerCase(); }
    if (Object.keys(projectParams).length > 0) {
        options.projection = projectParams;
    }
    const index = getCollectionIndex(indexType);
    const Model = await index.getModel();
    const result = await Model.findOneAndUpdate(updateCondtion, updateParams, options);
    return result;
};

const updateManyService = async (indexType, updateCondtion, updateParams) => {
    const options = {
        upsert: true,
    };
    const index = getCollectionIndex(indexType);
    const Model = await index.getModel();
    const result = await Model.updateMany(updateCondtion, updateParams, options);
    return result;
};

const deleteService = async (indexType, deleteCondtion) => {
    const index = getCollectionIndex(indexType);
    const Model = await index.getModel();
    const result = await Model.deleteMany(deleteCondtion);
    return result;
};

const setUserActionCount = async (indexType, updateId, field, value, recordType = 'Record', updateFields = {}) => {
    const checkRecordExists = await checkExists(indexType, { _id: updateId });
    if (!checkRecordExists || !checkRecordExists._id) {
        throw boom.notFound(`Invalid ${recordType}`);
    }
    const updateCondition = {
        _id: updateId,
    };
    let updateParams = {
        $inc: {},
    };
    updateParams.$inc[field] = value;
    if (Object.keys(updateFields).length > 0) {
        updateParams = {
            ...updateParams,
            ...updateFields,
        };
    }
    await updateOneService(indexType, updateCondition, updateParams);
};

const setUserActionMultiCount = async (indexType, updateId, fields, recordType = 'Record') => {
    const checkRecordExists = await checkExists(indexType, { _id: updateId });
    if (!checkRecordExists || !checkRecordExists._id) {
        throw boom.notFound(`Invalid ${recordType}`);
    }
    const updateCondition = {
        _id: updateId,
    };
    const updateParams = {
        $inc: {},
    };
    // eslint-disable-next-line no-restricted-syntax
    for (const field of Object.keys(fields)) {
        updateParams.$inc[field] = fields[field];
    }
    await updateOneService(indexType, updateCondition, updateParams);
};

module.exports = {
    checkExists,
    addService,
    bulkCreateService,
    listService,
    updateOneService,
    updateManyService,
    deleteService,
    ObjectId,
    setUserActionCount,
    setUserActionMultiCount,
};