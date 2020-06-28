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

// Include Advanced Results Middleware
const advancedResults = require('../middleware/advancedResults');
const Bootcamp = require('../models/Bootcamp');

const router = express.Router()

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router.route('/')
  .get( advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(createBootcamps)

router.route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp)

router.route('/radius/:zipcode/:distance')
  .get(getBootcampsInRadius)

router.route('/:id/photo')
  .put(bootcampPhotoUpload)

module.exports = router