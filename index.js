'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const OpenAIApi = require('openai');
const EventModel = require('./EventModel');
const handleEventsRequest = require('./events.js');
const handleRestaurantsRequest = require('./restaurants.js');
const { saveLocationToUser } = require('./userService');

const app = express();
app.use(cors());
app.use(express.json()); // Add JSON body parsing middleware

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the askAI function for chat requests
const askAI = async (input) => {
  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: input }],
    });
    return res.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Handle events creation
app.post('/events', async (req, res) => {
  try {
    const eventData = req.body;
    const newEvent = new EventModel(eventData);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Handle saving locations to a user
app.post('/saveLocation', async (req, res) => {
  const userEmail = req.body.userEmail;
  const location = req.body.location;

  try {
    const updatedUser = await saveLocationToUser(userEmail, location);

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handle chat requests
app.get('/chat', async (req, res) => {
  const prompt = req.query.message;

  // Check if the prompt contains keywords related to restaurants or locations
  const isRestaurantRelated = prompt.toLowerCase().includes('restaurant') || prompt.toLowerCase().includes('food');
  const isLocationRelated = prompt.toLowerCase().includes('location') || prompt.toLowerCase().includes('place');

  if (!isRestaurantRelated && !isLocationRelated) {
    // Return an error response
    return res.status(400).json({ error: 'Please enter a query related to restaurants or locations.' });
  }

  try {
    const message = await askAI(prompt);
    res.status(200).send(message);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Handle other routes
app.get('/events', handleEventsRequest);
app.get('/restaurants', handleRestaurantsRequest);

// Start the server
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
