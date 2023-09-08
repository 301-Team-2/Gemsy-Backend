'use strict';

const dotenv = require('dotenv').config();
const OpenAIApi = require('openai');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const handleEventsRequest = require('./events.js');
const handleRestaurantsRequest = require('./restaurants.js');
const readline = require('readline');
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;


const eventsRoute = require('./routes/events-database.js');
const restaurantRoute = require('./routes/restaurants-database.js');

const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY,
});

const askAI = async input => {
  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{role: 'user', content: input}]
  });

  return res.choices[0].message.content;
};

// openai.chat.completions.create({
//   model: 'gpt-3.5-turbo',
//   messages: [{role: 'user', content: input}]
// }).then(res => {
//   console.log(res.choices);
// });
const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
userInterface.prompt();
userInterface.on('line', async (input) => {
  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: input }],
  });
  console.log(res.choices);
  userInterface.prompt();

  // .then(res => {
  //   console.log(res.choices);
  // });
});

app.get('/chat', async (req, res) => {
  const prompt = req.query.message;

  let message = await askAI(prompt);
  res.status(200).send(message);
});

app.get('/events', handleEventsRequest);
app.get('/restaurants', handleRestaurantsRequest);

app.use('/events', eventsRoute);
app.use('/restaurants', restaurantRoute);

app.listen(PORT, () => {
  console.log('App is listening.');
});