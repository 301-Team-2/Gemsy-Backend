'use strict';

require('dotenv').config();
// const mongoose = require('mongoose');
const express = require('express');
// const cors = require('cors');
const EventModel = require('../EventModel.js');
// const authorize = require('../auth/authorize.js');
// const PORT = process.env.PORT || 3001;
const router = express.Router();
// const MONGODB_URL = process.env.MONGODB_URL;
const app = express();

// app.use(cors());
app.use(express.json());
// app.use(authorize);

// mongoose.connect(MONGODB_URL);

// get all events
router.get('/', async (req, res) => {
  try {
    let documents = await EventModel.find({});
    res.json(documents);
  } catch (error) {
    console.error('Could not connect', error);
  }
});

// save an event
router.post('/', async (req, res) => {
  let {
    name,
    image,
    description,
    event_url,
    latitude,
    longitude,
    time_end,
    time_start,
  } = req.body;
  let event = new EventModel({
    name,
    image,
    description,
    event_url,
    latitude,
    longitude,
    time_end,
    time_start,
  });
  let document = await event.save();
  res.json(document);
});

// delete an event
router.delete('/:eventId', async (req, res) => {
  if (!req.params.eventId) {
    res.status(404).send('Please provide a valid event ID.');
    return;
  }
  let result = await EventModel.findByIdAndDelete(req.params.eventId);
  res.status(204).send('Successfully deleted.');
});

module.exports = router;
