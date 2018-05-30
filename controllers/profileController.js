const mongoose = require("mongoose");
const Form = mongoose.model("Form");
const util = require("../util");

const getProfile = (req, res, next) => {
  try {
    Form.find({ _owner: req.session.userId }, (error, forms) => {
      if (error) {
        return util.error("could not load forms, please try again later", next);
      }

      if (!forms.length) {
        res.locals.errorMessage = "You dont have any forms yet";
      }

      forms = forms.map(form => ({
        ...form,
        createdAt: form.createdAt.toLocaleString(),
        updatedAt: form.updatedAt.toLocaleString()
      }));

      return res.render("profile", { forms });
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
