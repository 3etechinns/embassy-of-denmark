const mongoose = require("mongoose");
const PassportForm = mongoose.model("PassportForm");
const Notification = mongoose.model("Notification");
const FormRecord = mongoose.model("FormRecord");
const Payment = mongoose.model("Payment");
const VisaForm = mongoose.model("VisaForm");
const AppointmentForm = mongoose.model("AppointmentForm");
const FORM_TYPES = require("../formsTypes");
const util = require("../util");

const getModelName = type => {
  switch (type) {
    case FORM_TYPES.passportForm:
      return "PassportForm";
    case FORM_TYPES.VisaForm:
      return "VisaForm";
    case FORM_TYPES.appointment:
      return "AppointmentForm";
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
      /** loop through each property in the req.body and set empty ones to undefined
       for the purpose of mongoose providing a default value
       */
      for (prop in req.body) {
        if (!req.body[prop].trim()) {
          req.body[prop] = undefined;
        }
      }
    }

    /**
     * Only runs when the request is not of type 'continue-later'
     */
    if (req.query.type !== "continue-later") {
      // checking the existence of the date of birth
      if (!req.body.dateOfBirth) {
        return util.error(
          "Date of birth is required to submit this form",
          next
        );
      }
      const currentYear = new Date().getFullYear();
      const yearOfBirth = new Date(req.body.dateOfBirth).getFullYear();
      const age = currentYear - yearOfBirth;

      // ensures filling of parental consent when age is below
      if (
        age < 18 &&
        (!req.body.parentName.trim() ||
          !req.body.parentAddress.trim() ||
          !req.body.parentTelephoneNumber.trim() ||
          !req.files["parentalConsentSignature"])
      ) {
        return util.error(
          "Parental consent is required for people below age 18, please make sure you have filled such fields too",
          next
        );
      }

      /**
       * ensures guarantors information is provided, this is done because mongoose
       * can't validate nested objects within an array.
       */
      if (
        !req.body.guarantorsName1.trim() ||
        !req.body.guarantorsAddress1.trim() ||
        !req.body.guarantorsTelephoneNumber1.trim() ||
        !req.files["guarantorsSignature1"] ||
        !req.body.guarantorsName2.trim() ||
        !req.body.guarantorsAddress2.trim() ||
        !req.body.guarantorsTelephoneNumber2.trim() ||
        !req.files["guarantorsSignature2"]
      ) {
        return util.error(
          "Please make sure guarantor information is provided",
          next
        );
      }

      // Ensures declaration and witness signatures are uploaded
      if (
        !req.files["declarationSignature"] ||
        !req.files["witnessSignature"]
      ) {
        return util.error(
          "Please make sure declaration and witness signatures are uploaded",
          next
        );
      }
    }

    const guarantors = [
      {
        guarantorsName: req.body.guarantorsName1,
        guarantorsAddress: req.body.guarantorsAddress1,
        guarantorsTelephoneNumber: req.body.guarantorsTelephoneNumber1,
        guarantorsSignature: req.files["guarantorsSignature1"]
          ? req.files["guarantorsSignature1"][0].filename
          : undefined
      },
      {
        guarantorsName: req.body.guarantorsName2,
        guarantorsAddress: req.body.guarantorsAddress2,
        guarantorsTelephoneNumber: req.body.guarantorsTelephoneNumber2,
        guarantorsSignature: req.files["guarantorsSignature2"]
          ? req.files["guarantorsSignature2"][0].filename
          : undefined
      }
    ];

    // Ensures Previous passport number is entered for option attached/lost
    if (
      req.body.declarationOption === "attached/lost" &&
      !req.body.previousPassportNumber
    ) {
      return util.error(
        "Previous Passport number must be provided for Attached/lost Passports",
        next
      );
    }

    const signatures = {
      interpretersSignature: req.files["interpretersSignature"]
        ? req.files["interpretersSignature"][0].filename
        : undefined,
      parentalConsentSignature: req.files["parentalConsentSignature"]
        ? req.files["parentalConsentSignature"][0].filename
        : undefined,
      declarationSignature: req.files["declarationSignature"]
        ? req.files["declarationSignature"][0].filename
        : undefined,
      witnessSignature: req.files["witnessSignature"]
        ? req.files["witnessSignature"][0].filename
        : undefined
    };

    const passportForm = await PassportForm.create({
      ...req.body,
      guarantors,
      ...signatures
    });

    const formRecord = await FormRecord.create({
      _owner: req.session.userId,
      formId: passportForm._id,
      formType: FORM_TYPES.passportForm,
      isComplete: req.query.type === "continue-later" ? false : true,
      formCode: `P${Date.now()}`
    });

    const notification = await Notification.create({
      recipient: req.session.userId,
      title: "New Passport form created",
      message: `${formRecord.formType} ${
        formRecord.formCode
      } successfully created`
    });

    if (!passportForm || !formRecord) {
      return util.error(
        "sorry, we are having problems creating your form, try again later",
        next
      );
    }

    return res.redirect("/history");
  } catch (error) {
    console.log(error);
    // return util.error(error.message, next);
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
      isComplete: req.query.type === "continue-later" ? false : true,
      formCode: `V${Date.now()}`
    });

    const notification = await Notification.create({
      recipient: req.session.userId,
      title: "New Visa form created",
      message: `${formRecord.formType} ${
        formRecord.formCode
      } successfully created`
    });

    if (!visaForm || !formRecord) {
      return util.error(
        "sorry, we are having problems creating your form, try again later",
        next
      );
    }

    return res.redirect("/history");
  } catch (error) {
    let message = `${
      error.name
    }, please make sure all required fields are filled`;
    return util.error(message, next);
  }
};

const updateForm = async (req, res, next) => {
  try {
    let guarantors,
      signatures,
      references = [];

    if (req.query.type === "Passport") {
      guarantors = [
        {
          guarantorsName: req.body.guarantorsName1,
          guarantorsAddress: req.body.guarantorsAddress1,
          guarantorsTelephoneNumber: req.body.guarantorsTelephoneNumber1,
          guarantorsSignature: req.files["guarantorsSignature1"]
            ? req.files["guarantorsSignature1"][0].filename
            : req.body.guarantorsSignature1
        },
        {
          guarantorsName: req.body.guarantorsName2,
          guarantorsAddress: req.body.guarantorsAddress2,
          guarantorsTelephoneNumber: req.body.guarantorsTelephoneNumber2,
          guarantorsSignature: req.files["guarantorsSignature2"]
            ? req.files["guarantorsSignature2"][0].filename
            : req.body.guarantorsSignature2
        }
      ];

      signatures = {
        interpretersSignature: req.files["interpretersSignature"]
          ? req.files["interpretersSignature"][0].filename
          : req.body.interpretersSignature,
        parentalConsentSignature: req.files["parentalConsentSignature"]
          ? req.files["parentalConsentSignature"][0].filename
          : req.body.parentalConsentSignature,
        declarationSignature: req.files["declarationSignature"]
          ? req.files["declarationSignature"][0].filename
          : req.body.declarationSignature,
        witnessSignature: req.files["witnessSignature"]
          ? req.files["witnessSignature"][0].filename
          : req.body.witnessSignature
      };
    }

    if (req.query.type === "Visa") {
      references = [
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
    }

    const modelName = getModelName(req.query.type);
    const updated = await mongoose
      .model(modelName)
      .findOneAndUpdate(
        { _id: req.form._id },
        { ...req.body, guarantors, ...signatures, references },
        { new: true }
      );

    const notification = await Notification.create({
      title: `Form successfully updated`,
      message: `${req.query.type} form ${
        updated.formCode
      } updated successfully`,
      recipient: req.session.userId
    });
    return res.redirect("/history");
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

const editForm = (req, res, next) => {
  try {
    switch (req.query.type) {
      case "Passport":
        const fileFields = [
          "interpretersSignature",
          "parentalConsentSignature",
          "declarationSignature",
          "witnessSignature"
        ];

        // to help with updating input[type="file"] elements
        for (prop in req.form) {
          if (prop === "guarantors") {
            req.form[prop] = req.form[prop].map(guarantor => {
              return {
                ...guarantor,
                guarantorsSignature: guarantor.guarantorsSignature.trim()
              };
            });
          }

          if (fileFields.includes(prop) && req.form[prop]) {
            console.log(prop);
            req.form[prop] = req.form[prop].trim();
          }
        }

        return res.render("editPassportForm", {
          form: req.form,
          formRecordId: req.query.formRecordId
        });
      case "Visa":
        return res.render("editVisaForm", {
          form: req.form,
          formRecordId: req.query.formRecordId
        });
      case "Appointment":
        return res.render("editAppointmentForm", {
          form: req.form,
          formRecord: req.query.formRecordId
        });
      default:
        return res.redirect("/history");
    }
  } catch (error) {
    return next(error);
  }
};

const deleteForm = async (req, res, next) => {
  try {
    const model = mongoose.model(getModelName(req.query.type));

    const resp = await Promise.all([
      FormRecord.findOneAndRemove({ _id: req.params.formRecordId }),
      model.remove({ _id: req.query.formId })
    ]);

    const notification = await Notification.create({
      title: `Form successfully deleted`,
      message: `${req.query.type} form ${
        resp[0].formCode
      } deleted successfully`,
      recipient: req.session.userId
    });

    return res.redirect("/history");
  } catch (error) {
    return next(error);
  }
};

const createAppointmentForm = async (req, res, next) => {
  try {
    const appointmentForm = await AppointmentForm.create({ ...req.body });

    const formRecord = await FormRecord.create({
      _owner: req.session.userId,
      formId: appointmentForm._id,
      formType: FORM_TYPES.appointment,
      formCode: `A${Date.now()}`
    });

    const notification = await Notification.create({
      title: `New Appointment form created`,
      message: `${req.query.type} form ${
        resp[0].formCode
      } created successfully`,
      recipient: req.session.userId
    });

    return res.redirect("/history");
  } catch (error) {
    console.log(error);
    const message = `${
      error.name
    }, please make sure all required fields are filled`;
    error.message = message;
    return next(error);
  }
};

module.exports = {
  createPassportForm,
  createVisaForm,
  formIdParamHandler,
  editForm,
  updateForm,
  deleteForm,
  createAppointmentForm
};
