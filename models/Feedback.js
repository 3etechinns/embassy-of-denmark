const mongoose = require("mongoose");
const { Schema } = mongoose;

const FeedBackSchema = new Schema({
  embassyName: { type: String },
  embassyEmail: { type: String },
  subject: { type: String },
  message: { type: String }
});

module.exports = FeedBackSchema;
