'use strict';

const dotenv = require('dotenv').config();
const axios = require('axios');

const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;

const amadeusUrl =
  'https://test.api.amadeus.com/v1/reference-data/locations/pois';
const requestTokenUrl = 'https://test.api.amadeus.com/v1/security/oauth2/token';

// class PointOfInterest {
//   constructor(name) {}
// }

// function formatInterestData(interestData) {
//   const formattedInterestData = interestData.map((item) => {
//     let name = item.name;
//   });
// }

// fetching the access token from Amadeus API
let accessToken = '';
async function fetchAccessToken() {
  try {
    const response = await axios.post(
      `${requestTokenUrl}`,
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
  }
}

const handleInterestRequest = async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    res.status(400).send('Missing latitude or longitude');
    return;
  } else {
    let receivedInterestData = await getInterestData(lat, lon);
    let formattedInterestData = formatInterestData(receivedInterestData);
    res.status(200).jason(formattedInterestData);
  }
};

module.exports = handleInterestRequest;
