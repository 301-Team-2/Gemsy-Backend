'use strict';

const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

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
    const name = item.name;
    const image_url = item.image_url;
    const url = item.url;
    const rating = item.rating;
    const price = item.price;
    const location = `${item.location.display_address[0]}, ${item.location.display_address[1]}`;
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
    console.error('Error fetching restaurant data:', error.message);
    throw new Error('Failed to fetch restaurant data.');
  }
}

const handleRestaurantsRequest = async (req, res) => {
  const { searchQuery } = req.query;
  if (!searchQuery) {
    res.status(400).json({ error: 'Bad Request' });
    return;
  } else {
    try {
      const receivedRestaurantData = await getRestaurantData(searchQuery);
      const formattedRestaurantData = formatRestaurantData(
        receivedRestaurantData
      );
      res.status(200).json(formattedRestaurantData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = handleRestaurantsRequest;
