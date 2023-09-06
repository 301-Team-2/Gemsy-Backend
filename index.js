'use strict';

const OpenAIApi = require('openai');
const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const handleEventsRequest = require('./events.js');
const handleRestaurantsRequest = require('./restaurants.js');



const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY
});
openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [{role: 'user', content: 'This is a test!'}]
}).then(res => {
  console.log(res.choices);
});

console.log('your api key is: ' + process.env.OPENAI_API_KEY);
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
