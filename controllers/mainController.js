const mongoose = require("mongoose");
const FormRecord = mongoose.model("FormRecord");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
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
        updatedAt: formRecord.updatedAt.toLocaleDateString()
      }));

      return res.render("profile", { formRecords });
    })
      .lean()
      .exec();
  } catch (error) {
    return util.error(error.message, next);
  }
};

const accountSettings = (req, res, next) => {
  return res.render("settings", {
    updateMessage: req.session.updateMessage
  });
};

const updateAccountDetails = async (req, res, next) => {
  let { email, oldPassword, newPassword } = req.body;

  const updates = {};

  if (!email) {
    email = req.session.userEmail;
  }

  if (email !== undefined && email !== req.session.userEmail) {
    const existingUser = await User.findOne({ email: email.trim() });
    if (existingUser) {
      return res.render("settings", {
        message: "new email provided already exists"
      });
    }
  }

  if (oldPassword.trim() && !newPassword.trim()) {
    res.locals.message = "Please enter new Password too";
    return res.render("settings");
  }
  if (oldPassword.trim() && newPassword.trim()) {
    const user = await User.findById(req.session.userId);
    const matching = await bcrypt.compare(oldPassword, user.password);

    if (!matching) {
      res.locals.message = "old passwords do not match";
      return res.render("settings");
    }

    const hash = await bcrypt.hash(newPassword, 10);
    updates.password = hash;
  }

  updates.email = email;

  const updatedUser = await User.findByIdAndUpdate(
    req.session.userId,
    { ...updates },
    { new: true, select: { email: true } }
  )
    .lean()
    .exec();

  req.session.userEmail = updatedUser.email;
  req.session.updateMessage = "Account info successfully changed";
  req.session.save(err => {
    return res.redirect("/account");
  });
};

module.exports = {
  getProfile,
  accountSettings,
  updateAccountDetails
};
