const mongoose = require("mongoose");
const Form = mongoose.model("FormRecord");
const {
  newRequests,
  underProcessing,
  completedRequests,
  dispatchedRequests
} = require("../../processingStatus");

const requireLogin = (req, res, next) => {
  if (!req.session.userId || !req.session.isAdmin) {
    // return res.redirect("/admin/sign-in");
    return res.send("You must login as admin to access this page");
  }
  return next();
};

/**
 * Uncomment a lot of the stuff commented out here
 */

const getAllRequests = async (req, res, next) => {
  try {
    const skipValue = req.query.skip_value;
    const limitValue = req.query.limit_value;
    let formRecords = await Form.find({})
      .skip(skipValue || 0)
      .limit(limitValue || 8)
      .populate("_owner", "email")
      .lean()
      .exec();
    formRecords = formRecords.map(formRecord => {
      return {
        ...formRecord,
        createdAt: formRecord.createdAt.toLocaleDateString()
      };
    });
    req.allFormRecords = formRecords;
    return next();
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
        // { paymentId: { $exists: true } },
        // { isComplete: true },
        { status: newRequests }
      ]
    })
      .skip(skipValue || 0)
      .limit(limitValue || 4)
      .populate("_owner")
      .exec();
    req.newRequests = formRecords;
    return next();
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
        // { paymentId: { $exists: true } },
        // { isComplete: true },
        { status: underProcessing }
      ]
    })
      .populate("_owner")
      .exec();
    req.underProcessing = formRecords;
    return next();
    // return res.json(formRecords);
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
        // { paymentId: { $exists: true } },
        // { isComplete: true },
        { status: completedRequests }
      ]
    })
      .skip(skipValue || 0)
      .limit(limitValue || 4)
      .populate("_owner")
      .exec();
    req.completedRequests = formRecords;
    return next();
    // return res.json(formRecords);
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
        // { paymentId: { $exists: true } },
        // { isComplete: true },
        { status: dispatchedRequests }
      ]
    })
      .skip(skipValue || 0)
      .limit(limitValue || 4)
      .populate("_owner")
      .exec();
    req.dispatchedRequests = formRecords;
    return next();
    // return res.json(formRecords);
  } catch (error) {
    return res.json(error);
  }
};

module.exports = {
  getAllRequests,
  getNewRequests,
  getProcessingRequests,
  getCompletedRequests,
  getDispatchedRequests,
  requireLogin
};
