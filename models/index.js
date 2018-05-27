const mongoose = require("mongoose");
const { Schema } = mongoose;
const PassportFormSchema = require("./Passport");
const visaFormSchema = require("./Visa");
const UserSchema = require("./User");

const PassportForm = mongoose.model("PassportForm", PassportFormSchema);
const VisaForm = mongoose.model("VisaForm", visaFormSchema);
const User = mongoose.model("User", UserSchema);
