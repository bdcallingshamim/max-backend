const express = require('express');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); // Standardized import
const router = require('./routes/route');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(hpp());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true })); // CORS config
app.use(helmet());
app.use(cookieParser());
app.use(mongoSanitize());

app.use('/api/v1', router);
app.use('/images', express.static(path.join(__dirname, 'public/uploads')));

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log('Database connection successful!');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

module.exports = app;
