const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')

// Protect Routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token
  // Set token from Bearer Token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  // Set token from Cookie
  // else if (req.cookies.token) {
  //   token = req.cookies.token
  // }

  // Make sure token exits
  if(!token) {
    return next(new ErrorResponse('Not Authorized to Access this Route', 401))
  }

  try {
    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded.id)

    next()
  } catch (err) {
    return next(new ErrorResponse('Not Authorized to Access this Route', 401))
  }
})

// Grant Access to specific Roles
exports.authorize = (...roles) => (req, res, next) => {
  if(!roles.includes(req.user.role)) {
    return next(new ErrorResponse(`Not Authorized to Access this Route as ${req.user.role}`, 403))
  }
  next()
}
