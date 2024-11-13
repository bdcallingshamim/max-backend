const mongoose = require("mongoose");

const dataModel = new mongoose.Schema(
  {
    sub_title_EESS: { type: String, required: true, index: true },
    sub_title_IINN: { type: String, required: true, index: true },
    image: { type: String, required: true, index: true },
  },
  { timestamps: true, versionKey: false }
);

const aboutModel = mongoose.model("abouts", dataModel);
module.exports = aboutModel;
