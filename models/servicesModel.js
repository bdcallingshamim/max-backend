const mongoose = require("mongoose");

const dataModel = new mongoose.Schema(
    {
        title_EESS: {type: String, required: true, index: true},
        title_IINN: {type: String, required: true, index: true},
        description_EESS: {type: String, required: true, index: true},
        description_IINN: {type: String, required: true, index: true},
        image: {type: String, required: true, index: true},
    },
    {timestamps: true, versionKey: false}
);

const servicesModel = mongoose.model("services", dataModel);
module.exports = servicesModel;
