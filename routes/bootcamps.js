const express = require('express');

const {
  getBootcamps,
  getBootcamp,
  createBootcamps,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload
} = require('../controllers/bootcamps')

// Include other resource routers
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

const Bootcamp = require('../models/Bootcamp');

const router = express.Router()

// Include Advanced Results Middleware
const advancedResults = require('../middleware/advancedResults');

// Protect Routes Middleware
const { protect, authorize } = require('../middleware/auth')

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)
router.use('/:bootcampId/reviews', reviewRouter)

router.route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamps)

router.route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp)

router.route('/radius/:zipcode/:distance')
  .get(getBootcampsInRadius)

router.route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload)

module.exports = router