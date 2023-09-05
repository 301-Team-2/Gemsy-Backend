'use strict';

const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const handleEventsRequest = require('./events.js');

const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());

app.get('/events', handleEventsRequest);

app.listen(PORT, () => {
  console.log('App is listening.');
});
