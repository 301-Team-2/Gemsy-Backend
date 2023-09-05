'use strict';

const dotenv = require('dotenv').config();
const axios = require('axios');

const YELP_API_KEY = process.env.YELP_API_KEY;

const yelpUrl = 'https://api.yelp.com/v3';
