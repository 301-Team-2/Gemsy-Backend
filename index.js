'use strict';

const OpenAIApi = require('openai');
const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const handleEventsRequest = require('./events.js');
const handleRestaurantsRequest = require('./restaurants.js');
const readline = require('readline');

const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY
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
  output: process.stdout
});
userInterface.prompt();
userInterface.on('line', async input => {
  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{role: 'user', content: input}]
  });
  console.log(res.choices);
  userInterface.prompt();

  // .then(res => {
  //   console.log(res.choices);
  // });


});


const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());

app.get('/chat', async (req, res) => {
  const prompt = req.query.message;

  let message = await askAI(prompt);
  res.status(200).send(message);
});

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
