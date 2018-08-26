const mongoose = require("mongoose");
const { Schema } = mongoose;

const PersonnelSchema = new Schema({
  fullName: {
    first: { type: String, required: true, trim: true },
    last: { type: String, required: true, trim: true }
  },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true },
  assignments: [Schema.Types.ObjectId],
  isAdmin: { type: Boolean, default: false }
});

module.exports = PersonnelSchema;
