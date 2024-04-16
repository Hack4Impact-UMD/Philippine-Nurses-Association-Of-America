const express = require('express'); //Wont need this in final build
const axios = require('axios');
const cors = require('cors');
const fs = require('fs'); //Wont need this in final build

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyAef0b2KDrdWCcKJBmOW88PX4FZLtrn8Co",
    authDomain: "pnaa-8b56f.firebaseapp.com",
    projectId: "pnaa-8b56f",
    storageBucket: "pnaa-8b56f.appspot.com",
    messagingSenderId: "1072615861967",
    appId: "1:1072615861967:web:8ed5ad49a18b5a2b0651ba",
    measurementId: "G-HW8Z1LHJSM"
  };

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
  

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
    await new Promise(resolve => setTimeout(resolve, 5001)); // Wait for 5 seconds before retrying
    response = await axios.get(response.data.ResultUrl, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  // Save the data to a local file
  fs.writeFileSync('contactsData.json', JSON.stringify(response.data.Contacts, null, 2));

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
    // const accessToken = await getAccessToken();

    // if (!accessToken) {
    //   return res.status(500).send('Failed to obtain access token');
    // }

    // const membershipLevelData = await memberShipLevels(accessToken);
    // acceptTermsOfUse(accessToken)

    // const contactsData = await fetchContactsData(accessToken);
    
    // console.log("ENDPOINT DATA", contactsData);

    const contactsData = readDataLocally();
    
    // const cleanedData = cleanData(contactsData);

    const testdata = {
        "PNA Georgia": {
          totalActive: 5,
          totalLapsed: 3,
          members: [
            { name: "John Doe", email: "john@example.com", membershipLevel: "Active Member (1 year)", activeStatus: "Active", renewalDueDate: "2023-05-20" },
          ]
        }
      };


    // try {
    //     await updateData(testdata);
    //     console.log("Data updated successfully");
    // } catch (error) {
    //     console.error("Failed to update data:", error);
    // }
  
    res.json(testdata);

  } catch (error) {
    console.error('Error fetching members:', error);
    // res.status(500).send('Server error');
  }
});


function processMembershipData(data) {
    const chaptersData = {};
  
    data.forEach(contact => {
      const chapterField = contact.FieldValues.find(field => field.FieldName === "Chapter (Active/Associate - 1 year)");
      const renewalField = contact.FieldValues.find(field => field.FieldName === "Renewal due");
      const currentDate = new Date();  // Get the current date
      const renewalDate = renewalField ? new Date(renewalField.Value) : null;
      const isActive = renewalDate ? renewalDate >= currentDate : false;
      const membershipLevel = contact.MembershipLevel ? contact.MembershipLevel.Name : 'Unknown';
      const memberInfo = {
        name: `${contact.FirstName} ${contact.LastName}`,
        email: contact.Email,
        membershipLevel,
        activeStatus: isActive ? 'Active' : 'Lapsed',
        renewalDueDate: renewalDate ? renewalDate.toISOString().substring(0, 10) : 'N/A'
      };
  
      if (chapterField && chapterField.Value && chapterField.Value.Label) {
        const chapter = chapterField.Value.Label;
  
        // Initialize chapter object if not already present
        if (!chaptersData[chapter]) {
          chaptersData[chapter] = {
            totalActive: 0,
            totalLapsed: 0,
            members: []
          };
        }
  
        // Increment counts based on active status
        if (isActive) {
          chaptersData[chapter].totalActive++;
        } else {
          chaptersData[chapter].totalLapsed++;
        }
  
        // Add member info to the combined list
        chaptersData[chapter].members.push(memberInfo);
      }
    });
  
    console.log(JSON.stringify(chaptersData, null, 2));
    return chaptersData;
  }


  async function updateData(data) {
    const chaptersCollection = collection(db, 'chapters');

    for (const [chapterName, chapterData] of Object.entries(data)) {
        const chapterDoc = doc(chaptersCollection, chapterName);

        // Set or update main chapter data with total counts
        await setDoc(chapterDoc, {
            totalActive: chapterData.totalActive,
            totalLapsed: chapterData.totalLapsed
        }, { merge: true });

        const membersCollection = collection(chapterDoc, 'members');

        // Upload all members with merge option
        for (const member of chapterData.members) {
            const memberDoc = doc(membersCollection); // Creating a new document for each member
            await setDoc(memberDoc, member, { merge: true });
        }
    }
}

function getTotalActiveCount(chapterData) {
  return Object.values(chapterData).reduce((sum, chapter) => sum + chapter.activeCount, 0);
}


function getChapterList(data) {
  const chapterSet = new Set();

  data.forEach(contact => {
    const chapterField = contact.FieldValues.find(field => field.FieldName === "Chapter (Active/Associate - 1 year)");
    if (chapterField && chapterField.Value && chapterField.Value.Label) {
      chapterSet.add(chapterField.Value.Label);
    }
  });

  console.log("Chapter Set:", chapterSet);
}

function cleanData(data) {
  const filteredData = data.filter(entry => {
      return entry.hasOwnProperty('MembershipLevel') && Object.keys(entry.MembershipLevel).length > 0;
  });

  const validMembers = filteredData.filter(entry => {
      return entry.MembershipLevel.hasOwnProperty('Id') && entry.MembershipLevel.Id !== null && entry.MembershipLevel.Id !== undefined && entry.MembershipLevel.Id !== "";
  });
  return validMembers;
}



function readDataLocally() {
  try {
    const data = fs.readFileSync('contactsData/contactsData.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading contacts data:', error);
    return [];
  }
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});