const mongoose = require("mongoose");
const PassportForm = mongoose.model("PassportForm");
const FormRecord = mongoose.model("FormRecord");
const Payment = mongoose.model("Payment");
const VisaForm = mongoose.model("VisaForm");
const FORM_TYPES = require("../formsTypes");
const util = require("../util");

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
      console.log("err");
      return util.error(
        "we are having problems fetching form data, please try again later",
        next
      );
    }

    const form = await mongoose
      .model(modelName)
      .findById(formId)
      .exec();

    if (!form) {
      console.log("error occured");
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

    // ensures filling of parental consent when age is below 18 and form is not a save
    // and continue later type
    if (req.query.type !== "continue-later") {
      const currentYear = new Date().getFullYear();
      const yearOfBirth = new Date(req.body.dateOfBirth).getFullYear();
      const age = currentYear - yearOfBirth;

      if (
        req.body.dateOfBirth &&
        (age < 18 &&
          (!req.body.parentName.trim() ||
            !req.body.parentAddress.trim() ||
            !req.body.parentTelephoneNumber.trim()))
      ) {
        return util.error(
          "Parental consent is required for people below age 18, please make sure you have filled such fields too",
          next
        );
      }

      // ensuring guarantors information is provided when the request is not a save and
      // continue later one
      if (
        (!req.body.guarantorsName1.trim(),
        !req.body.guarantorsAddress1.trim(),
        !req.body.guarantorsTelephoneNumber1.trim(),
        !req.body.guarantorsSignature1.trim(),
        !req.body.guarantorsName2.trim(),
        !req.body.guarantorsAddress2.trim(),
        !req.body.guarantorsTelephoneNumber2.trim(),
        !req.body.guarantorsSignature2.trim())
      ) {
        return util.error(
          "Please make sure guarantor information is provided",
          next
        );
      }
    }

    const guarantors = [
      {
        guarantorsName: req.body.guarantorsName1,
        guarantorsAddress: req.body.guarantorsAddress1,
        guarantorsTelephoneNumber: req.body.guarantorsTelephoneNumber1,
        guarantorsSignature: req.body.guarantorsSignature1
      },
      {
        guarantorsName: req.body.guarantorsName2,
        guarantorsAddress: req.body.guarantorsAddress2,
        guarantorsTelephoneNumber: req.body.guarantorsTelephoneNumber2,
        guarantorsSignature: req.body.guarantorsSignature2
      }
    ];

    const passportForm = await PassportForm.create({
      ...req.body,
      guarantors
    });

    const formRecord = await FormRecord.create({
      _owner: req.session.userId,
      formId: passportForm._id,
      formType: FORM_TYPES.passportForm,
      isComplete: req.query.type === "continue-later" ? false : true
    });

    if (!passportForm || !formRecord) {
      return util.error(
        "sorry, we are having problems creating your form, try again later",
        next
      );
    }

    return res.redirect("/profile");
  } catch (error) {
    // error.message = "Please fill all required fields";
    return util.error(
      "Please make sure all required fields have been filled",
      next
    );
  }
};

const createVisaForm = async (req, res, next) => {
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

    /**
     * Please ensure consistency in the model and pug files and then u can make changes
     *  to thi side like how we did for the guarantors information in the passport form
     */
    const references = [
      {
        fullName: req.body.guarantorsName1,
        address: req.body.guarantorsAddress1,
        telephoneNumber: req.body.guarantorsTelephoneNumber1
      },
      {
        fullName: req.body.guarantorsName2,
        address: req.body.guarantorsAddress2,
        telephoneNumber: req.body.guarantorsTelephoneNumber2
      }
    ];

    const visaForm = await VisaForm.create({
      ...req.body,
      references
    });

    const formRecord = await FormRecord.create({
      _owner: req.session.userId,
      formId: visaForm._id,
      formType: FORM_TYPES.VisaForm,
      isComplete: req.query.type === "continue-later" ? false : true
    });

    if (!visaForm || !formRecord) {
      return util.error(
        "sorry, we are having problems creating your form, try again later",
        next
      );
    }

    return res.redirect("/profile");
  } catch (error) {
    // error.message = "Please fill all required fields";
    return util.error(
      "Please make sure all required fields have been filled",
      next
    );
  }
};

const editForm = (req, res, next) => {
  try {
    switch (req.query.type) {
      case "Passport":
        return res.render("editPassportForm", {
          form: req.form,
          formRecordId: req.query.formRecordId
        });
      case "Visa":
        return res.render("editVisaForm", {
          form: req.form,
          formRecordId: req.query.formRecordId
        });
      default:
        return res.redirect("/profile");
    }
  } catch (error) {
    return next(error);
  }
};

const updateForm = async (req, res, next) => {
  try {
    // This side is to ensure that all fields are filed before setting the isComplete
    // property on the form record to true
    if (req.query.aim !== "continue-later") {
      const unfilled = [];
      for (prop in req.body) {
        if (!req.body[prop].trim()) {
          unfilled.push(prop);
        }
      }

      if (unfilled.length > 0) {
        let message = "Please make sure you have filled ";
        unfilled.forEach(item => {
          message += item + ", ";
        });
        return util.error(message, next);
      }

      console.log("first");
      const formRecord = await FormRecord.update(
        {
          _id: req.query.formRecordId
        },
        { isComplete: true },
        { new: true }
      );
      const forrm = await FormRecord.findById(req.query.formRecordId);
      console.log(forrm);
    }

    const guarantors = [
      {
        guarantorsName: req.body.guarantorsName1,
        guarantorsAddress: req.body.guarantorsAddress1,
        guarantorsTelephoneNumber: req.body.guarantorsTelephoneNumber1,
        guarantorsSignature: req.body.guarantorsSignature1
      },
      {
        guarantorsName: req.body.guarantorsName2,
        guarantorsAddress: req.body.guarantorsAddress2,
        guarantorsTelephoneNumber: req.body.guarantorsTelephoneNumber2,
        guarantorsSignature: req.body.guarantorsSignature2
      }
    ];

    const references = [
      {
        fullName: req.body.guarantorsName1,
        address: req.body.guarantorsAddress1,
        telephoneNumber: req.body.guarantorsTelephoneNumber1
      },
      {
        fullName: req.body.guarantorsName2,
        address: req.body.guarantorsAddress2,
        telephoneNumber: req.body.guarantorsTelephoneNumber2
      }
    ];

    const modelName = getModelName(req.query.type);
    const updateInfo = await mongoose
      .model(modelName)
      .updateOne(
        { _id: req.form._id },
        { ...req.body, guarantors, references },
        { new: true }
      )
      .lean()
      .exec();

    return res.redirect("/profile");
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

const deleteForm = async (req, res, next) => {
  try {
    const model = mongoose.model(getModelName(req.query.type));

    const resp = await Promise.all([
      FormRecord.remove({ _id: req.params.formRecordId }),
      model.remove({ _id: req.query.formId })
    ]);

    return res.redirect("/profile");
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createPassportForm,
  createVisaForm,
  formIdParamHandler,
  editForm,
  updateForm,
  deleteForm
};
