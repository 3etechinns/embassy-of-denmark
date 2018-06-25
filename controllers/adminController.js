const mongoose = require("mongoose");
const Form = mongoose.model("FormRecord");
const {
  newRequests,
  underProcessing,
  completedRequests,
  dispatchedRequests
} = require("../processingStatus");

const getAllRequests = async (req, res, next) => {
  try {
    const skipValue = req.query.skip_value;
    const limitValue = req.query.limit_value;
    const formRecords = await Form.find()
      .skip(skipValue || 0)
      .limit(limitValue || 4)
      .populate("_owner", "_id")
      .exec();
    return res.json(formRecords);
  } catch (error) {
    return next(error);
  }
};

const getNewRequests = async (req, res, next) => {
  try {
    const skipValue = req.query.skip_value;
    const limitValue = req.query.limit_value;
    const formRecords = await Form.find({
      $and: [
        { paymentId: { $exists: true } },
        { isComplete: true },
        { status: newRequests }
      ]
    })
      .skip(skipValue || 0)
      .limit(limitValue || 4)
      .populate("_owner")
      .exec();
    return res.json(formRecords);
  } catch (error) {
    return res.json(error);
  }
};

const getProcessingRequests = async (req, res, next) => {
  try {
    const skipValue = req.query.skip_value;
    const limitValue = req.query.limit_value;
    const formRecords = await Form.find({
      $and: [
        { paymentId: { $exists: true } },
        { isComplete: true },
        { status: underProcessing }
      ]
    })
      .populate("_owner")
      .exec();
    return res.json(formRecords);
  } catch (error) {
    return res.json(error);
  }
};

const getCompletedRequests = async (req, res, next) => {
  try {
    const skipValue = req.query.skip_value;
    const limitValue = req.query.limit_value;
    const formRecords = await Form.find({
      $and: [
        { paymentId: { $exists: true } },
        { isComplete: true },
        { status: completedRequests }
      ]
    })
      .skip(skipValue || 0)
      .limit(limitValue || 4)
      .populate("_owner")
      .exec();
    return res.json(formRecords);
  } catch (error) {
    return res.json(error);
  }
};

const getDispatchedRequests = async (req, res, next) => {
  try {
    const skipValue = req.query.skip_value;
    const limitValue = req.query.limit_value;
    const formRecords = await Form.find({
      $and: [
        { paymentId: { $exists: true } },
        { isComplete: true },
        { status: dispatchedRequests }
      ]
    })
      .skip(skipValue || 0)
      .limit(limitValue || 4)
      .populate("_owner")
      .exec();
    return res.json(formRecords);
  } catch (error) {
    return res.json(error);
  }
};

module.exports = {
  getAllRequests,
  getNewRequests,
  getProcessingRequests,
  getCompletedRequests,
  getDispatchedRequests
};
