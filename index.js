'use strict';

const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const handleEventsRequest = require('./events.js');
const handleRestaurantsRequest = require('./restaurants.js');

const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());

app.get('/events', handleEventsRequest);
app.get('/restaurants', handleRestaurantsRequest);
// app.post('/events', (req res) => {
//   console.log('SOMEONE HAS POSTED TO /events!!');
//   try {
//     const searchFormData = req.body;

//     res.json({ message: 'Data received successfully' });
//   } cstch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ })
//   }
// });

app.listen(PORT, () => {
  console.log('App is listening.');
});
