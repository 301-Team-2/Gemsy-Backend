'use strict';

const dotenv = require('dotenv').config();
const axios = require('axios');

const YELP_API_KEY = process.env.YELP_API_KEY;

const yelpUrl = 'https://api.yelp.com/v3';

class Event {
  constructor(
    description,
    image_url,
    name,
    event_site_url,
    latitude,
    longitude,
    time_end,
    time_start
  ) {
    this.description = description;
    this.image_url = image_url;
    this.name = name;
    this.event_site_url = event_site_url;
    this.latitude = latitude;
    this.longitude = longitude;
    this.time_end = time_end;
    this.time_start = time_start;
  }
}

function formatEventData(eventData) {
  const formattedEventData = eventData.map((item) => {
    let description = item.description;
    let image_url = item.image_url;
    let name = item.name;
    let event_site_url = item.event_site_url;
    let latitude = item.latitude;
    let longitude = item.longitude;
    let time_end = item.time_end;
    let time_start = item.time_start;

    return new Event(
      description,
      image_url,
      name,
      event_site_url,
      latitude,
      longitude,
      time_end,
      time_start
    );
  });
  return formattedEventData;
}

async function getEventData(location) {
  // try {
  const customHeaders = {
    Authorization: `Bearer ${YELP_API_KEY}`,
    'Content-Type': 'application/json',
  };
  const response = await axios.get(
    `${yelpUrl}/events?location=${location}&limit=10`,
    {
      headers: customHeaders,
    }
  );
  return response.data.events;
  // } catch (error) {
  //   console.error(error);

  // }
}

const handleEventsRequest = async (req, res) => {
  const { searchQuery } = req.query;
  if (!searchQuery) {
    res.status(400).send('Bad Request');
    console.log();
    return;
  } else {
    let recievedEventData = await getEventData(searchQuery);
    let formattedEventData = formatEventData(recievedEventData);
    res.status(200).json(formattedEventData);
  }
};

module.exports = handleEventsRequest;
