'use strict';

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); 
const EventModel = require('../EventModel.js');
const router = express.Router();

router.use(express.json());

// Get all events
router.get('/', async (req, res) => {
  try {
    let documents = await EventModel.find({});
    res.json(documents);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Save an event
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
  try {
    let document = await event.save();
    res.json(document);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete an event
router.delete('/:eventId', async (req, res) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).send('Invalid event ID.');
    return;
  }

  try {
    let result = await EventModel.findByIdAndDelete(eventId);
    if (!result) {
      res.status(404).send('Event not found.');
    } else {
      res.status(204).send('Successfully deleted.');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
