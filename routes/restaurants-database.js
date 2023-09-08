'use strict';

require('dotenv').config();
const express = require('express');
const RestaurantModel = require('../RestaurantModel.js');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let documents = await RestaurantModel.find({});
    res.json(documents);
  } catch (error) {
    console.error('Could not connect to restaurant DB', error);
    res.status(500).send('Internal Server Error');
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

  try {
    let document = await restaurant.save();
    res.json(document);
  } catch (error) {
    console.error('Error saving restaurant', error);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/:restaurantId', async (req, res) => {
  if (!req.params.restaurantId) {
    res.status(404).send('Please provide a valid restaurant ID.');
    return;
  }

  try {
    let result = await RestaurantModel.findByIdAndDelete(req.params.restaurantId);
    if (result) {
      res.status(204).send('Successfully deleted.');
    } else {
      res.status(404).send('Restaurant not found.');
    }
  } catch (error) {
    console.error('Error deleting restaurant', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
