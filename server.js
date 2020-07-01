const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const path = require('path');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

//Load env variables
dotenv.config({
  path: './config/config.env',
});

//Connect to Database
connectDB();

//Route Files
const auth = require('./routes/auth');
const users = require('./routes/users');
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const reviews = require('./routes/reviews');

const app = express();

//Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File Uploading Middleware
app.use(fileupload());

// Sanitize Data
app.use(mongoSanitize());

// Set Security Headers
app.use(helmet());

// Prevent Cross-Site-Scripting Attacks
app.use(xss());

// Rate Limiting All APIS for 100APIs in 10mins
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10mins
  max: 100, // API Limit
});
app.use(limiter);

// Prevent Http Param Pollution
app.use(hpp());

// Allow CORS Policy
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount Routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/reviews', reviews);

//Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold
  );
});

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`.red);
  //Close Server & exit process
  server.close(() => process.exit(1));
});
