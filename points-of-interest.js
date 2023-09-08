'use strict';

require('dotenv').config();
const axios = require('axios');

const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;

const amadeusUrl = 'https://test.api.amadeus.com/v1/reference-data/locations/pois';
const requestTokenUrl = 'https://test.api.amadeus.com/v1/security/oauth2/token';

let accessToken = '';

async function fetchAccessToken() {
  try {
    const response = await axios.post(
      requestTokenUrl,
      `grant_type=client_credentials&client_id=${AMADEUS_API_KEY}&client_secret=${AMADEUS_API_SECRET}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    accessToken = response.data.access_token;
    console.log('Access token retrieved:', accessToken);
  } catch (error) {
    console.error('Error fetching access token:', error);
    // Handle the error, send an error response, or exit the application.
    // You should not continue with an empty access token.
  }
}

async function getInterestData(lat, lon) {
  try {
    const response = await axios.get(
      `${amadeusUrl}?latitude=${lat}&longitude=${lon}&radius=10&`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Could not get interest data', error);
    // Handle the error, send an error response, or handle it gracefully.
  }
}

const handleInterestRequest = async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    res.status(400).send('Missing latitude or longitude');
    return;
  } else {
    try {
      let receivedInterestData = await getInterestData(lat, lon);
      // Implement formatting if needed
      res.status(200).json(receivedInterestData);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = handleInterestRequest;
