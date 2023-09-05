'use strict';

const dotenv = require('dotenv').config();
const axios = require('axios');

const YELP_API_KEY = process.env.YELP_API_KEY;

const yelpUrl = 'https://api.yelp.com/v3';

const handleEventsRequest = async (req, res) => {
  try {
    const customHeaders = {
      Authorization: `Bearer ${YELP_API_KEY}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.get(`${yelpUrl}/events`, {
      headers: customHeaders,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occured' });
  }
};

module.exports = handleEventsRequest;
