'use strict';

// require('dotenv').config();
const express = require('express');
const RestaurantModel = require('../RestaurantModel.js');
const router = express.Router();
// const app = express();

router.get('/', async (req, res) => {
  try {
    let documents = await RestaurantModel.find({});
    res.json(documents);
  } catch (error) {
    console.error('Could not connect to restaurant DB', error);
  }
});

router.post('/', async (req, res) => {
  let { name, image, url, rating, price, location } = req.body;
  let restaurant = new RestaurantModel({
    name,
    image,
    url,
    rating,
    price,
    location,
  });
  let document = await restaurant.save();
  res.json(document);
});

router.delete('/restaurantId', async (req, res) => {
  if (!req.params.restaurantId) {
    res.status(404).send('Please provide a valid restaurant ID.');
    return;
  }
  let result = await RestaurantModel.findByIdAndDelete(req.params.restaurantId);
  res.status(204).send('Successfully deleted.');
});

module.exports = router;
