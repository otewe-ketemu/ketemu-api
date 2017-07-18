const mongoose = require('mongoose')
const Schema = mongoose.Schema

let meetupSchema = new Schema({
    title: String,
    description: String,
    meetingTime: Date,
    confirmationTime: Date,
    typePlaces: {
        type: String,
        enum: ['coworking_space', 'library', 'bar', 'cafe', 'shopping_mall', 'restaurant', 'park', 'lodging']
    },
    placeAddressName: String,
    placeAddressGeolocation: {
        type: [Number],
        index: '2d',
        sparse: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    participants: [{
      user: {
          type: Schema.Types.ObjectId,
          ref: 'User'
      },
      status: {
        type: String,
        default: 'pending'
      },
      locationName: {
        type: String,
        default: ''
      }
      locationGeolocation: {
        type: [Number],
        index: '2d',
        sparse: true
      }
    }],
    status: {
        type: String,
        default: 'TBA'
    },
    location60: [String],
    location30: [String],
    location15: [String],
    createdDate: {
        type: Date,
        default: Date.now()
    },
    updatedDate: {
        type: Date,
        default: Date.now()
    }
})

let Meetup = mongoose.model('Meetup', meetupSchema)
module.exports = Meetup
