const mongoose = require('mongoose')
const slugify = require('slugify')

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Add a Name'],
    unique: true,
    trim: true,
    maxlength: [50, "Name can't be more than 50 characters"]
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please Add a Description'],
    maxlength: [500, "Description can't be more than 500 characters"]
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please enter a valid URL with HTTP or HTTPS'
    ]
  },
  phone: {
    type: String,
    maxlength: [20, "Phone number can't exceed than 20 numbers"]
  },
  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please enter a valid email'
    ]
  },
  address: {
    type: String,
    required: [true, 'Please Add an Address']
  },
  location: {
    //GeoJSON Point
    type: {
      type: String,
      enum: ['Point'], // 'location.type' must be 'Point'
      // required: true
    },
    coordinates: {
      type: [Number],
      // required: true,
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  careers: {
    //Array of Strings
    type: [String],
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'UI/UX',
      'Data Science',
      'Business',
      'Others'
    ]
  },
  averageRating: {
    type: Number,
    min: [1, 'Ratings must at least be 1'],
    max: [10, "Ratings can't exceed 10"]
  },
  averageCost: Number,
  photo: {
    type: String,
    default: 'no-photo.jpg'
  },
  housing: {
    type: Boolean,
    default: false
  },
  jobAssistance: {
    type: Boolean,
    default: false
  },
  jobGuarantee: {
    type: Boolean,
    default: false
  },
  acceptGi: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

BootcampSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {
    lower: true
  })
  next()
})

module.exports = mongoose.model('Bootcamp', BootcampSchema)