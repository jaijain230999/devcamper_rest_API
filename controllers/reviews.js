const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId })

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    })  
  }
  else res.status(200).json(res.advancedResults)
})

// @desc    Get single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  })

  if(!review) {
    return next(new ErrorResponse(`Review not found for ID:${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: review
  });
})

// @desc    Add a Review
// @route   POST /api/v1/bootcamps/:bootcampId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId
  req.body.user = req.user.id

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)

  if(!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found for ID:${req.params.bootcampId}`, 404))
  }

  // Check if the review belongs to the user only
  if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} not Authorized to Add a Review ${review._id} for the Bootcamp`, 401))
  }
  
  const review = await Review.create(req.body)

  res.status(201).json({
    success: true,
    data: review
  });
    
})

// @desc    Update a Review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {

  let review = await Review.findById(req.params.id);

  if(!review) {
    return next(new ErrorResponse(`Review not found for ID:${req.params.id}`, 404))
  }

  // Check if the review belongs to the user only
  if(review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} not Authorized to Update the Review ${review._id}`, 401))
  }
  
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: review
  });
    
})

// @desc    Delete a review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if(!review) {
    return next(new ErrorResponse(`Review not found for ID:${req.params.id}`, 404))
  }

  // Check if the review belongs to the user only
  if(review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} not Authorized to Update the Review ${review._id}`, 401))
  }

  await review.remove()

  res.status(200).json({
    success: true,
    data: `Review ${req.params.id} deleted`
  });
    
})