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
        res.locals.errorMessage = "You do not have any form Records yet";
      }

      formRecords = formRecords.map(formRecord => ({
        ...formRecord,
        createdAt: formRecord.createdAt.toLocaleDateString(),
        updatedAt: formRecord.updatedAt.toLocaleDateString()
      }));

      return res.render("history", {
        formRecords,
        headerText: "History"
      });
    })
      .lean()
      .exec();
  } catch (error) {
    return util.error(error.message, next);
  }
};

const accountSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    return res.render("profile", {
      updateMessage: req.session.updateMessage,
      headerText: "Profile",
      ...user
    });
  } catch (error) {
    return next(error);
  }
};

const updateAccountDetails = async (req, res, next) => {
  let {
    email,
    oldPassword,
    newPassword,
    confirmPassword,
    bio,
    fullName,
    telephoneNumber,
    residentialAddress
  } = req.body;

  const user = await User.findById(req.session.userId);
  console.log("user is ", user);

  const updates = {};

  if (!email.trim()) {
    email = req.session.userEmail;
  }

  if (email !== undefined && email !== req.session.userEmail) {
    const existingUser = await User.findOne({ email: email.trim() });
    if (existingUser) {
      return res.render("profile", {
        message: "New email provided already exists",
        headerText: "Profile",
        ...user
      });
    }
  }

  if (oldPassword.trim() && (!newPassword.trim() || !confirmPassword.trim())) {
    res.locals.message = "Please enter new Password too";
    return res.render("profile", { headerText: "Profile", ...user });
  }
  if (oldPassword.trim() && newPassword.trim() && confirmPassword.trim()) {
    const matching = await bcrypt.compare(oldPassword, user.password);

    if (!matching) {
      res.locals.message = "old passwords do not match";
      return res.render("profile", { headerText: "Profile", ...user });
    }

    if (newPassword !== confirmPassword) {
      res.locals.message = "passwords do not match";
      return res.render("profile", { headerText: "Profile", ...user });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    updates.password = hash;
  }

  updates.email = email;
  updates.bio = bio;
  updates.residentialAddress = residentialAddress;
  updates.telephoneNumber = telephoneNumber;
  updates.fullName = fullName;

  const updatedUser = await User.findByIdAndUpdate(
    req.session.userId,
    { ...updates },
    { new: true, select: { password: false } }
  )
    .lean()
    .exec();

  req.session.userEmail = updatedUser.email;
  console.log(updatedUser);
  req.session.save(err => {
    return res.render("profile", {
      ...updatedUser,
      updateMessage: "Account info successfully changed"
    });
  });
};

module.exports = {
  getProfile,
  accountSettings,
  updateAccountDetails
};
