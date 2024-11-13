const userModel = require('../models/userModel');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const registerUserController = async (req, res) => {
  try {
    const { username, email, password, confirm_password, role } = req.body;
    const file = req.file;

    // Check if the email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'failed', message: 'Email already exists' });
    }

    // Check if passwords match
    if (password !== confirm_password) {
      return res.status(400).json({ status: 'failed', message: 'Passwords do not match' });
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new userModel({
      username,
      email,
      password,
      role,
    });

    await user.save();

    res.status(201).json({ status: 'ok', message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error in registerUserController:', error);
    res.status(500).json({ status: 'failed', error: 'Error registering user' });
  }
};

const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await userModel.findOne({ email:email });
    if (!existingUser) {
      return res.status(404).json({ status: 'failed', message: 'Email not found' });
    }

    const isPasswordCorrect = existingUser.password === password;
    if (!isPasswordCorrect) {
      return res.status(401).json({ status: 'failed', message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email, role: existingUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h', algorithm: 'HS256' },
    );

    return res
      .status(200)
      .cookie('token', token) //{ httpOnly: true, maxAge: 2 * 60 * 60 * 1000 }
      .json({ status: 'ok', message: 'Logged in successfully' });
  } catch (error) {
    console.error('Error in loginUserController:', error);
    res.status(500).json({ status: 'failed', error: 'An error occurred during login' });
  }
};

const sendOtpController = async (req, res) => {
  const email = req.body.email;
  try {
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ status: 'failed', message: 'Mail is not exist' });
    } else {
      let transport = nodemailer.createTransport({
        service: 'Gmail',
        secure: true,
        port: 465,
        auth: {
          user: process.env.mailUser,
          pass: process.env.appPass,
        },
      });

      const otp = Math.floor(1000 + Math.random() * 9000).toString();

      await userModel.updateOne({ email: email }, { $set: { otp: otp } });

      setTimeout(async () => {
        await userModel.updateOne({ email }, { $set: { otp: null } });
      }, 30000);

      let mailOption = {
        from: 'Shamim Al Mamun <bdcallingshamim@gmail.com>',
        to: email,
        subject: 'Otp code from max sinapsis',
        text: `Your otp code is : ${otp}. Don't share to anyone.`,
      };
      await transport.sendMail(mailOption);

      res.status(200).json({ status: 'ok', message: 'Mail is send' });
    }
  } catch (error) {
    res.status(500).json('Faild to send mail');
  }
};

const verifyOtpController = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const user = await userModel.findOne({ email: email });

    if (user.otp === null) {
      res.status(200).json({ status: 200, message: 'OTP is expired' });
    } else if (user.otp === otp) {
      res.status(200).json({ status: 'ok', message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ status: 'failed', message: 'Invalid OTP' });
    }
  } catch (error) {
    res.status(500).json({ status: 'failed', error: 'Error verifying OTP' });
  }
};

const changePasswordController = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    await userModel.updateOne(
      { email: email },
      { $set: { password: newPassword, confirm_password: newPassword } },
    );

    res.status(200).json({ status: 'ok', message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ status: 'failed' });
  }
};

const routeProtectionController = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ status: 'failed', message: 'Access denied. No token provided.' });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    res
      .status(200)
      .json({ userId: decode['userId'], email: decode['email'], role: decode['role'] });
  } catch (error) {
    res.status(500).json('There is an error');
  }
};

module.exports = {
  registerUserController,
  loginUserController,
  sendOtpController,
  verifyOtpController,
  changePasswordController,
  routeProtectionController,
};
