const mongoose = require("mongoose");

const dataModel = new mongoose.Schema(
  {
    serial_number: { type: String, required: true, index: true },
    title_EESS: { type: String, required: true, index: true },
    title_IINN: { type: String, required: true, index: true },
    location_EESS: { type: String, required: true, index: true },
    location_IINN: { type: String, required: true, index: true },
    description_EESS: { type: String, required: true, index: true },
    description_IINN: { type: String, required: true, index: true },
  },
  { timestamps: true, versionKey: false }
);

const projectsModel = mongoose.model("projects", dataModel);
module.exports = projectsModel;
