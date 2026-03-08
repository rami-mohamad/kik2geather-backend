const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Field", fieldSchema); // collection: fields
