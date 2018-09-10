const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const util = require("../util");
const User = mongoose.model("User");

const createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return util.error("an account with same email already exists", next);
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      ...req.body,
      password: hash
    });
    req.session.userId = user._id;
    req.session.userEmail = user.email;
    res.session.fullName = user.fullName;
    return res.redirect("/history");
  } catch (error) {
    return next(error);
  }
};

const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("login", {
        errorMessage: "No user exists with the provided email"
      });
    }

    const matching = await bcrypt.compare(password, user.password);
    if (!matching) {
      return res.render("login", {
        errorMessage: "Incorrect password"
      });
    }
    req.session.userId = user._id;
    req.session.userEmail = user.email;
    req.session.successMessage = "Welcome back!";
    req.session.fullName = user.fullName;
    return res.redirect("/history");
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    req.session.destroy(() => {
      return res.redirect("/");
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createUser,
  logIn,
  logout
};
