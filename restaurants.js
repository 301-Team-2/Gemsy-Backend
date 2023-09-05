'use strict';

const dotenv = require('dotenv').config();
const axios = require('axios');

const YELP_API_KEY = process.env.YELP_API_KEY;

const yelpUrl = 'https://api.yelp.com/v3/businesses/search';

class Restaurant {
  constructor(name, image_url, url, rating, price, location) {
    this.name = name;
    this.image_url = image_url;
    this.url = url;
    this.rating = rating;
    this.price = price;
    this.location = location;
  }
}

function formatRestaurantData(restaurantData) {
  const formattedRestaurantData = restaurantData.map((item) => {
    let name = item.name;
    let image_url = item.image_url;
    let url = item.url;
    let rating = item.rating;
    let price = item.price;

    let location = `${item.location.display_address[0]},${item.location.display_address[1]}`;
    return new Restaurant(name, image_url, url, rating, price, location);
  });
  return formattedRestaurantData;
}

async function getRestaurantData(location) {
  try {
    const customHeaders = {
      Authorization: `Bearer ${YELP_API_KEY}`,
      'Content-Type': 'application/json',
    };
    const response = await axios.get(
      `${yelpUrl}?location=${location}&term=restaurants`,
      {
        headers: customHeaders,
      }
    );
    return response.data.businesses;
  } catch (error) {
    console.error(error);
    return error;
  }
}

const handleRestaurantsRequest = async (req, res) => {
  const { searchQuery } = req.query;
  if (!searchQuery) {
    res.status(400).send('Bad Request');
    console.log();
    return;
  } else {
    let recievedRestaurantData = await getRestaurantData(searchQuery);
    let formattedRestaurantData = formatRestaurantData(recievedRestaurantData);
    res.status(200).json(formattedRestaurantData);
  }
};

module.exports = handleRestaurantsRequest;
