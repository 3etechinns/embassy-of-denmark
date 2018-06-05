const mongoose = require("mongoose");
const FormRecord = mongoose.model("FormRecord");
const util = require("../util");

const getProfile = (req, res, next) => {
  try {
    FormRecord.find({ _owner: req.session.userId }, (error, formRecords) => {
      if (error) {
        return util.error(
          "could not load your formRecords, please try again later",
          next
        );
      }

      if (!formRecords.length) {
        res.locals.errorMessage = "You dont have any form Records yet";
      }

      formRecords = formRecords.map(formRecord => ({
        ...formRecord,
        createdAt: formRecord.createdAt.toLocaleDateString(),
        updatedAt: formRecord.updatedAt.toLocaleString()
      }));

      return res.render("profile", { formRecords });
    })
      .lean()
      .exec();
  } catch (error) {
    return util.error(error.message, next);
  }
};

module.exports = {
  getProfile
};
