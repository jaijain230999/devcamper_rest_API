const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

// Load env variables
dotenv.config({ path: './config/config.env' })

// Load Models
const User = require('./models/User')
const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')
const Review = require('./models/Review')

// Connect to db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})

// Read JSON Files
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'))
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8'))

// Import Data into db
const importData = async () => {
  try {
    await User.create(users)
    await Bootcamp.create(bootcamps)
    await Course.create(courses)
    await Review.create(reviews)
    console.log('Data Imported into db...'.green.inverse)
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

// Delete Data from db
const deleteData = async () => {
  try {
    await User.deleteMany()
    await Bootcamp.deleteMany()
    await Course.deleteMany()
    await Review.deleteMany()
    console.log('Data Destroyed from db...'.red.inverse)
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

// Command Line argv to import and delete data
if(process.argv[2] === '-i') importData()
else if(process.argv[2] === '-d') deleteData()
