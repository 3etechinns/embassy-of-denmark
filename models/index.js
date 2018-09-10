const mongoose = require("mongoose");
const { Schema } = mongoose;
const PassportFormSchema = require("./Passport");
const visaFormSchema = require("./Visa");
const UserSchema = require("./User");
const FormRecordSchema = require("./FormRecord");
const PaymentSchema = require("./Payment");
const PersonnelSchema = require("./Personnel");
const FeedBackSchema = require("./Feedback");
const PriceSchema = require("./Price");
const AppointmentFormSchema = require("./AppointmentForm");
const NotificationSchema = require("./Notification");
const SuggestionSchema = require("./Suggestion");

const PassportForm = mongoose.model("PassportForm", PassportFormSchema);
const VisaForm = mongoose.model("VisaForm", visaFormSchema);
const User = mongoose.model("User", UserSchema);
const FormRecord = mongoose.model("FormRecord", FormRecordSchema);
const Payment = mongoose.model("Payment", PaymentSchema);
const FeedBack = mongoose.model("FeedBack", FeedBackSchema);
const Price = mongoose.model("Price", PriceSchema);
const AppointmentForm = mongoose.model(
  "AppointmentForm",
  AppointmentFormSchema
);
const Personnel = mongoose.model("Personnel", PersonnelSchema);
const Notification = mongoose.model("Notification", NotificationSchema);
const Suggestion = mongoose.model("Suggestion", SuggestionSchema);
