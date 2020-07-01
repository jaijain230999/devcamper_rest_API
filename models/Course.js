const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please Add a Course Title']
  },
  description: {
    type: String,
    required: [true, 'Please Add a Course Description']
  },
  weeks: {
    type: String,
    required: [true, 'Please Add a Course Duration']
  },
  tuition: {
    type: Number,
    required: [true, 'Please Add a Course Tuition Cost']
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please Add the Minimum Skill sets required'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarshipsAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
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

// static method on schema to get average cost of course tuitions for a bootcamp
CourseSchema.statics.getAverageCost = async function(bootcampId){
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' }
      }
    }
  ])

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    })
  } catch (err) {
    console.error(err)
  }
}

// Call getAverageCost after save
CourseSchema.post('save', function() {
  this.constructor.getAverageCost(this.bootcamp)
})

// Call getAverageCost before remove
CourseSchema.pre('remove', function() {
  this.constructor.getAverageCost(this.bootcamp)
})

module.exports = mongoose.model('Course', CourseSchema)