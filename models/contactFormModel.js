const mongoose = require('mongoose');

const contactFormSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,    
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    messageType:{
      type:String,
      required:true,
    }
  },
  { timestamps: true , versionKey:false},
);

const contactFormModel = mongoose.model('message', contactFormSchema);

module.exports = contactFormModel;
