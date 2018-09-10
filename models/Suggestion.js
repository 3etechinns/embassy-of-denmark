const mongoose = require("mongoose");
const { Schema } = mongoose;

const SuggestionSchema = new Schema({
  name: String,
  email: String,
  message: String
});

module.exports = SuggestionSchema;
