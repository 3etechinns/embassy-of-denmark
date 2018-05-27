const mongoose = require("mongoose");
const util = require("../util");
const PassportForm = mongoose.model("PassportForm");
const VisaForm = mongoose.model("VisaForm");

const createPassportForm = async (req, res, next) => {
  try {
    const {
      guarantorsName1,
      guarantorsAddress1,
      guarantorsTelephoneNumber1,
      guarantorsName2,
      guarantorsAddress2,
      guarantorsTelephoneNumber2,
      witnessName,
      witnessOccupation,
      witnessWorkPlaceAddress,
      witnessTelephoneNumber,
      witnessResidentialAddress,
      witnessDate,
      fathersName,
      fathersNationality,
      fathersAddress,
      mothersName,
      mothersNationality,
      mothersAdrress
    } = req.body;

    console.log(witnessDate);

    const guarantors = [
      {
        guarantorsName: guarantorsName1,
        guarantorsAddress: guarantorsAddress1,
        guarantorsTelephoneNumber: guarantorsTelephoneNumber1
      },
      {
        guarantorsName: guarantorsName2,
        guarantorsAddress: guarantorsAddress2,
        guarantorsTelephoneNumber: guarantorsTelephoneNumber2
      }
    ];

    const witness = {
      witnessName,
      witnessOccupation,
      witnessWorkPlaceAddress,
      witnessTelephoneNumber,
      witnessResidentialAddress,
      witnessDate
    };

    const evidenceOfCitizenship = {
      fathersName,
      fathersNationality,
      fathersAddress,
      mothersName,
      mothersNationality,
      mothersAdrress
    };

    const form = await PassportForm.create({
      ...req.body,
      guarantors,
      witness,
      evidenceOfCitizenship
    });

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
