const express = require('express');
const axios = require('axios');
const cors = require('cors');
const admin = require("firebase-admin");

const app = express();
app.use(cors());

//Paste API info here:



async function getAccessToken() {
    const url = 'https://oauth.wildapricot.org/auth/token';
    const headers = {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    const response = await axios.post(url, body, { headers: headers });

    if (response.status !== 200) {
        throw new Error('Failed to get access token');
    }
    
    return response.data.access_token;
}

async function fetchEvents(accessToken) {

  let response = await axios.get(`https://api.wildapricot.com/v2.1/accounts/${accountId}/events`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data.Events;
}


app.get('/api/events', async (req, res) => {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return res.status(500).send('Failed to obtain access token');
    }

    const eventData = await fetchEvents(accessToken);
    // console.log('EVENT DATA', eventData);
    res.json(eventData);
  } catch (error) {
    console.error('Error fetching members:', error);
  }
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});