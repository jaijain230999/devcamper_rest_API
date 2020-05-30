// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: 'Get all bootcamps'
  })
}

// @desc    Get single bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    mgs: `Get Bootcamp${req.params.id}`
  })
}

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamps = (req, res, next) => {
  res.status(200).json({
    success: true,
    mgs: 'Add new Bootcamp'
  })
}

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    mgs: `Update Bootcamp${req.params.id}`
  })
}

// @desc    Delete bootcamp
// @route   Delete /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    mgs: `Delete Bootcamp${req.params.id}`
  })
}