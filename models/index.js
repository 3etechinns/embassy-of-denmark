const mongoose = require("mongoose");
const { Schema } = mongoose;
const PassportFormSchema = require("./Passport");
const visaFormSchema = require("./Visa");
const UserSchema = require("./User");
const FormSchema = require("./Form");
const PaymentSchema = require("./Payment");

const PassportForm = mongoose.model("PassportForm", PassportFormSchema);
const VisaForm = mongoose.model("VisaForm", visaFormSchema);
const User = mongoose.model("User", UserSchema);
const Form = mongoose.model("FormRecord", FormSchema);
const Payment = mongoose.model("Payment", PaymentSchema);
