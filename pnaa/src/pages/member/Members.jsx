import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { db } from "../../config/firebase.ts";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/members');
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        const data = await response.json();
        console.log("DATA", data);

        updateData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

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




  if (isLoading) {
    return <div>Fetching data from Wild Apricot's database...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <p>*Note: Changes to Wild Apricot will take ~ 5 min to be reflected.</p>
      <p>*Note: 40 requests per minute limit.</p>
      <h1>Members</h1>
      <ul>
        {members && members.map((member, index) => (
          <li key={index}>
            <h2>{member.DisplayName}</h2>
            <p>Organization: {member.Organization || 'N/A'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Members;
