const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      default: 'Ana Laura Vargas P.O. Box 3016-1000 San José, Costa Rica',
    },
    telephone: {
      type: String,
      default: '+(506) 2289-7141',
    },
    mobile: {
      type: String,
      default: '+(506) 7017-7472',
    },
    email: {
      type: String,
      default: 'alaura@projectartwork.com',
    },
  },
  { timestamps: true , versionKey:false},
);

const contactModel = mongoose.model('contact', contactSchema);

async function initializeContact() {
  try {
    const count = await contactModel.countDocuments();
    if (count === 0) {
      await contactModel.create({});
    } 
  } catch (error) {
    console.error('Error initializing contact document:', error);
  }
}

initializeContact();

module.exports = contactModel;
