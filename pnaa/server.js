const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());


async function getAccessToken() {
    const url = 'https://oauth.wildapricot.org/auth/token';
    const apiKey = 'cnpoZW5nMjU6eW1tazdmb2plZnV0aTQwcnNzZnFmOGZyd3VtNGVy';
    const headers = {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    const body = 'grant_type=password&username=rzheng25@terpmail.umd.edu&password=XYt$wCjvV5h8gAA&scope=auto';

    const response = await axios.post(url, body, { headers: headers });

    if (response.status !== 200) {
        throw new Error('Failed to get access token');
    }
    
    return response.data.access_token;
}

async function fetchContactsData(accessToken) {
  // Initial request to the contacts endpoint
  let response = await axios.get('https://api.wildapricot.com/v2.1/accounts/213319/contacts', {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  });

  // Poll the ResultUrl until the Contacts array is not empty
  while (!response.data.Contacts || response.data.Contacts.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
    response = await axios.get(response.data.ResultUrl, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  return response.data.Contacts; //Returns only the contacts
}

async function acceptTermsOfUse(accessToken) {
  const url = `https://api.wildapricot.com/v2.1/rpc/213319/acceptTermsOfUse`;
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  const response = await axios.post(url, {}, { headers: headers });

  if (response.status !== 200) {
    throw new Error('Failed to accept terms of use');
  }

  console.log('Terms of use accepted');
}

async function memberShipLevels(accessToken) {
  const url = `https://api.wildapricot.com/v2.1/accounts/213319/membershipLevels`;
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  const response = await axios.get(url, { headers: headers });

  if (response.status !== 200) {
    throw new Error('Failed to accept terms of use');
  }

  console.log("FADFASDFSAF", response.data);
  return response.data;
}

app.get('/api/members', async (req, res) => {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return res.status(500).send('Failed to obtain access token');
    }

    // const membershipLevelData = await memberShipLevels(accessToken);
    // acceptTermsOfUse(accessToken)

    const contactsData = await fetchContactsData(accessToken);
    
    // console.log("ENDPOINT DATA", contactsData);
    res.json(contactsData);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});