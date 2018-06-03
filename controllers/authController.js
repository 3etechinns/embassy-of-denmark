const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const util = require("../util");
const User = mongoose.model("User");

const createUser = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      return util.error("all fields required", next);
    }

    if (password !== confirmPassword) {
      return util.error("passwords do not match", next);
    }

    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return util.error("an account with same email already exists", next);
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hash
    });
    req.session.userId = user._id;
    req.session.userEmail = user.email;
    res.locals.currentUser = user.email;
    return res.redirect("/forms/passport");
  } catch (error) {
    return next(error);
  }
};

const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return util.error("No user exists with the provided email", next);
    }

    const matching = await bcrypt.compare(password, user.password);
    if (!matching) {
      return util.error("Incorrect password", next, 403);
    }
    req.session.userId = user._id;
    req.session.userEmail = user.email;
    return res.redirect("/profile");
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await req.session.destroy();
    return res.redirect("/");
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createUser,
  logIn,
  logout
};
