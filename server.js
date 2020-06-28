const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const path = require('path')
const fileupload = require('express-fileupload')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')

//Load env variables
dotenv.config({
  path: './config/config.env',
});

//Connect to Database
connectDB();

//Route Files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

const app = express();

//Body Parser
app.use(express.json())

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File Uploading Middleware
app.use(fileupload())

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')))

//Mount Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses)

//Error Handler Middleware
app.use(errorHandler)

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