const crypto = require('crypto')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Add a Name']
  },
  email: {
    type: String,
    required: [true, 'Please Add an Email'],
    unique: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please enter a valid email'
    ]
  },
  role: {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please Add a Password'],
    minlength: 6,
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Encrypt password using bcryptjs
UserSchema.pre('save', async function (next) {
  // If Password is not changed
  if(!this.isModified('password')) next()
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

// Generate JWT to registered user
UserSchema.methods.getSignedJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

// Match user entered password with hashed password in db
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Generate and Hash Password Token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate Token
  const resetToken = crypto.randomBytes(20).toString('hex')

  // Hash token and set to resetPasswordToken
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

  return resetToken
}

module.exports = mongoose.model('User', UserSchema)