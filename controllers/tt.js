const nonCompulsoryFields = [
      "languageInterpretedIn",
      "interpreterName",
      "interpreterAddress",
      "interpreterTelephoneNumber",
      "interpretationDate",
      "parentalConsentMetaData",
      "parentName",
      "parentAddress",
      "parentalConsentSignature",
      "parentTelephoneNumber"
    ];

    const fileFields = [
      "guarantorsSignature1",
      "guarantorsSignature2",
      "interpretersSignature",
      "parentalConsentSignature",
      "declarationSignature",
      "witnessSignature"
    ];

    // for setting properties on the request body that have values of a file
    console.log(req.files);
    for (prop in req.files) {
      console.log(prop);
      console.log(fileFields.includes(prop));
      // if (prop === "guarantorsSignature1" || prop === "guarantorsSignature2") {
      //   req.body.guarantors = []
      // }
      if (fileFields.includes(prop)) {
        req.body[prop] = req.files[prop] ? req.files[prop][0].name : "";
        console.log(req.body[prop]);
      }
    }

    // This side is to ensure that all fields are filled before setting the isComplete
    // property on the form record to true
    if (req.query.aim !== "continue-later") {
      const unfilled = [];
      for (prop in req.body) {
        if (!req.body[prop].trim() && !nonCompulsoryFields.includes(prop)) {
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

      const formRecord = await FormRecord.update(
        {
          _id: req.query.formRecordId
        },
        { isComplete: true },
        { new: true }
      );
      const form = await FormRecord.findById(req.query.formRecordId);
    }

    // for handling update of passport form
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

    // for handling update of visa form
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
      );

    console.log(updateInfo);