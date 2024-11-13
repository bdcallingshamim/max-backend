const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    otp: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, versionKey: false },
);

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
