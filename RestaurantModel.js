'use strict';

const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  url: {
    type: String,
    require: true,
  },
  rating: {
    type: String,
    require: true,
  },
  price: {
    type: String,
    require: true,
  },
  location: {
    type: String,
    require: true,
  },
});

const RestaurantModel = mongoose.model('restaurants', RestaurantSchema);

module.exports = RestaurantModel;
