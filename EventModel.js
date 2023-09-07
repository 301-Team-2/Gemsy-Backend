'use strict';

const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  event_url: {
    type: String,
    require: true,
  },
  latitude: {
    type: String,
    require: true,
  },
  longitude: {
    type: String,
    require: true,
  },
  time_end: {
    type: String,
    require: true,
  },
  time_start: {
    type: String,
    require: true,
  },
});

const EventModel = mongoose.model('events', EventSchema);

module.exports = EventModel;
