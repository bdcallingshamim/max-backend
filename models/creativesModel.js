const mongoose = require("mongoose");

const dataModel = new mongoose.Schema(
  {
    title_EESS: { type: String, required: true, index: true },
    title_IINN: { type: String, required: true, index: true },
    sub_title_EESS: { type: String, required: true, index: true },
    sub_title_IINN: { type: String, required: true, index: true },
    image: { type: String, index: true },
    content_EESS: { type: String, required: true, index: true },
    content_IINN: { type: String, required: true, index: true },
  },
  { timestamps: true, versionKey: false }
);

const creativesModel = mongoose.model("creatives", dataModel);
module.exports = creativesModel;
