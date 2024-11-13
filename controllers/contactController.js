const contactModel = require('../models/contactModel');

const updateContactInfo = async (req, res) => {
  try {
    await contactModel.updateOne(req.body);
    res.status(201).json({ status: 'ok', message: 'location updated' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'There is an error' });
  }
};

const getContactInfo = async (req, res) => {
  try {
    const data = await contactModel.findOne();
    res.status(200).json({ status: 'ok', statuscode: 200, data: data });
  } catch (error) {
    res.status(500).json({ status: 'error', statuscode: 500 });
  }
};

module.exports = { updateContactInfo, getContactInfo };
