const mongoose = require('mongoose')

const ReviewSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please Add a Title for the Review'],
    maxlength: [100, "Title can't be more than 100 characters"]
  },
  text: {
    type: String,
    required: [true, 'Please Add Some Text for the Review'],
    maxlength: [500, "Description can't be more than 500 characters"]
  },
  rating: {
    type: Number,
    min: 1,
    max: 10, 
    required: [true, 'Please Add a Rating between 1 and 10 for the Review']
  },
  bootcamp : {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
})

// Allow only 1 Review per Bootcamp for the User
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true })

// static method on schema to get average rating of reviews for a bootcamp
ReviewSchema.statics.getAverageRating = async function(bootcampId){
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' }
      }
    }
  ])

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageRating: parseFloat(obj[0].averageRating.toFixed(2))
    })
  } catch (err) { 
    console.error(err)
  }
}

// Call getAverageRating after save
ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.bootcamp)
})

// Call getAverageRating before remove
ReviewSchema.pre('remove', function() {
  this.constructor.getAverageRating(this.bootcamp)
})

module.exports = mongoose.model('Review', ReviewSchema)