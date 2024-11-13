const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    title_EESS: {
      type: String,
      required: true,
    },
    title_IINN: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    thumbs: {
      type: Array,
      required: true,
    },
    details: {
      sub_Title_EESS: {
        type: String,
        required: true,
      },
      sub_Title_IINN: {
        type: String,
        required: true,
      },
      sub_desc_EESS: {
        type: String,
        required: true,
      },
      sub_desc_IINN: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true, versionKey: false },
);

const portfolioModel = mongoose.model('portfolio', portfolioSchema);

module.exports = portfolioModel;
