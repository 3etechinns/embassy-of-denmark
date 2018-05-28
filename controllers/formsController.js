const mongoose = require("mongoose");
const util = require("../util");
const PassportForm = mongoose.model("PassportForm");
const VisaForm = mongoose.model("VisaForm");

const createPassportForm = async (req, res, next) => {
  try {
    // for forms submitted to be continued later
    if (req.query.type === "continue-later") {
      // loop through each property in the req.body and set empty ones to undefined
      for (prop in req.body) {
        if (!req.body[prop].trim()) {
          req.body[prop] = undefined;
        }
      }
    }
    const guarantors = [
      {
        guarantorsName: req.body.guarantorsName1,
        guarantorsAddress: req.body.guarantorsAddress1,
        guarantorsTelephoneNumber: req.body.guarantorsTelephoneNumber1
      },
      {
        guarantorsName: req.body.guarantorsName2,
        guarantorsAddress: req.body.guarantorsAddress2,
        guarantorsTelephoneNumber: req.body.guarantorsTelephoneNumber2
      }
    ];

    // console.log(req.body);

    const form = await PassportForm.create({
      ...req.body,
      guarantors
    });

    console.log("old passport is " + form.oldPassport);

    if (!form) {
      return util.error(
        "sorry, we are having problems processing your form, try again later",
        next
      );
    }

    return res.json(form);
  } catch (error) {
    // error.message = "Please fill all required fields";
    return next(error);
  }
};

const createVisaForm = async (req, res, next) => {
  try {
    const form = await VisaForm.create({ ...req.body });

    if (!form) {
      return util.error(
        "sorry, we are having problems processing your form, try again latter",
        next
      );
    }

    return res.json(form);
  } catch (error) {
    error.message = "Please fill all required fields";
    return next(error);
  }
};

module.exports = {
  createPassportForm,
  createVisaForm
};
