const mongoose = require("mongoose");
const util = require("../util");
const PassportForm = mongoose.model("PassportForm");
const Form = mongoose.model("Form");
const VisaForm = mongoose.model("VisaForm");
const FORM_TYPES = require("../formsTypes");

const getModelName = type => {
  switch (type) {
    case FORM_TYPES.passportForm:
      return "PassportForm";
    case FORM_TYPES.VisaForm:
      return "VisaForm";
    default:
      return "";
  }
};

const formIdParamHandler = async (req, res, next, formId) => {
  try {
    const type = req.query.type;
    const modelName = getModelName(type);

    if (!modelName) {
      return util.error(
        "we are having problems fetching form data, please try again later",
        next
      );
    }

    const form = await mongoose
      .model(modelName)
      .findById(formId)
      .lean()
      .exec();

    if (!form) {
      return util.error("could not load form data, try again later", next);
    }
    req.form = form;
    return next();
  } catch (error) {
    return util.error(error.message, next);
  }
};

const createPassportForm = async (req, res, next) => {
  try {
    // for forms submitted to be continued later
    if (req.query.type === "continue-later") {
      // loop through each property in the req.body and set empty ones to undefined
      // for the purpose of mongoose providing a default value
      for (prop in req.body) {
        if (!req.body[prop].trim()) {
          req.body[prop] = undefined;
        }
      }
    }

    const currentYear = new Date().getFullYear();
    const yearOfBirth = new Date().getFullYear();

    const age = currentYear - yearOfBirth;

    // ensures filling of parental consent when age is below 18 and form is not a save
    // and continue later type
    if (req.query.type !== "continue-later") {
      if (
        (age < 18 && !req.body.parentName.trim()) ||
        !req.body.parentAddress.trim() ||
        !req.body.parentTelephoneNumber.trim()
      ) {
        return util.error(
          "Parental consent is necessary for people below age 18, please make sure you have filled such fields too",
          next
        );
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

    const passportForm = await PassportForm.create({
      ...req.body,
      dateOfBirth: new Date(req.body.dateOfBirth).valueOf(),
      witnessDate: new Date(req.body.witnessDate).valueOf(),
      guarantors
    });

    const formRecord = await Form.create({
      _owner: req.session.userId,
      formId: passportForm._id,
      formType: FORM_TYPES.passportForm
    });

    if (!passportForm) {
      return util.error(
        "sorry, we are having problems processing your form, try again later",
        next
      );
    }

    return res.redirect("/profile");
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

const editForm = (req, res, next) => {
  return res.render("editForm", { form: req.form });
};

const viewForm = (req, res, next) => {
  return res.render("viewForm");
};

module.exports = {
  createPassportForm,
  createVisaForm,
  formIdParamHandler,
  editForm,
  viewForm
};
