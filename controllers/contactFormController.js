const contactFormModel = require('../models/contactFormModel');
const nodemailer = require('nodemailer');

const sendMessage = async (req, res) => {
  try {
    const { full_name, telephone, address, city, state, zip, country, email, message } = req.body;

    await contactFormModel.create({
      full_name,
      telephone,
      address,
      city,
      state,
      zip,
      country,
      email,
      message,
      messageType: 'receive',
    });

    let transport = nodemailer.createTransport({
      service: 'Gmail',
      secure: true,
      port: 465,
      auth: {
        user: process.env.mailUser,
        pass: process.env.appPass,
      },
    });

    let mailOption = {
      from: 'Shamim Al Mamun <bdcallingshamim@gmail.com>',
      to: 'shamimalmamun651@gmail.com',
      subject: `${full_name} wants to contact`,
      text: `${full_name} wants to contact with you. Here is the full details
            Email:${email},
            Telephone:${telephone},
            Address:${address},
            City:${city},
            State:${state},
            zip:${zip},
            country:${country},
            message:${message}`,
    };
    await transport.sendMail(mailOption);

    res.status(200).json({ status: 'ok', message: 'Message send successfully' });
  } catch (error) {
    res.status(500).json('There is an error');
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await contactFormModel.find().sort({ createdAt: -1 });
    res.status(201).json({ status: 'ok', data: messages });
  } catch (error) {
    res.status(500).json({ status: 'failed', message: 'Something wents wrong' });
  }
};

const replyMessage = async (req, res) => {
  const { email, subject, message } = req.body;
  try {
    let transport = nodemailer.createTransport({
      service: 'Gmail',
      secure: true,
      port: 465,
      auth: {
        user: process.env.mailUser,
        pass: process.env.appPass,
      },
    });

    let mailOption = {
      from: 'Shamim Al Mamun <bdcallingshamim@gmail.com>',
      to: email,
      subject: subject,
      text: message,
    };

    await transport.sendMail(mailOption);

    res.status(200).json({ status: 'ok', message: 'Message send' });
  } catch (error) {
    res.status(500).json({ status: 'failed', message: 'Something wents wrong' });
  }
};

module.exports = { sendMessage, getMessages, replyMessage };
