// const moment = require('moment');
const mongoose = require('mongoose');
const index = require('./index');

const { ObjectId } = mongoose.Types;

const checkExists = async(getCondition) => {
    const Model = await index.getModel();
    const userCheck = await Model.findOne(getCondition, '-__v');
    return userCheck;
};

const addService = async(addParams) => {
    const Model = await index.getModel();
    const newRecord = new Model(addParams);
    const saveRecord = await newRecord.save();
    return saveRecord;
};

const listService = async() => {
    const Model = await index.getModel();
    const list = await Model.find({ status: 1 }, '-__v').sort({ key: 1 });
    return list;
};

const updateService = async(updateCondtion, updateParams) => {
    const options = {
        new: true,
    };
    const Model = await index.getModel();
    const result = await Model.findOneAndUpdate(updateCondtion, updateParams, options);
    return result;
};

const deleteService = async(deleteCondtion) => {
    const Model = await index.getModel();
    const result = await Model.deleteMany(deleteCondtion);
    return result;
};

module.exports = {
    checkExists,
    addService,
    listService,
    updateService,
    deleteService,
};