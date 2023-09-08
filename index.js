'use strict';

require('dotenv').config();

const OpenAIApi = require('openai');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const EventModel = require('./EventModel');
const handleEventsRequest = require('./events.js');
const handleRestaurantsRequest = require('./restaurants.js');
const { saveLocationToUser } = require('./userService');

const readline = require('readline');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

mongoose.connect('mongodb://joshshea44:b3x2u1qbrCSwSKbg@cluster0.fjkgyrj.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const User = mongoose.model('User', {
  name: String,
  email: String,
  savedLocations: [{ type: String }],
});

const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY,
});

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

const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
userInterface.prompt();

userInterface.on('line', async (input) => {
  try {
    const message = await askAI(input);
    console.log(message);
  } catch (error) {
    console.error('Error:', error);
  }
  userInterface.prompt();
});

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

app.get('/chat', async (req, res) => {
  const prompt = req.query.message;
  try {
    const message = await askAI(prompt);
    res.status(200).send(message);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/events', handleEventsRequest);
app.get('/restaurants', handleRestaurantsRequest);

app.get('/api/saved-locations', async (req, res) => {
  if (!req.user || !req.user.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const userEmail = req.user.email;

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.savedLocations);
  } catch (error) {
    console.error('Error fetching saved locations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
