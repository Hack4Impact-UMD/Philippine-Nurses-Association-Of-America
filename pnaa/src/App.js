import React, { useState, useEffect } from 'react';
import './App.css';
import db from './firebase-config';
import { collection, addDoc, getDocs, query } from "firebase/firestore";

function App() {
  const [chapters, setChapters] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [memberName, setMemberName] = useState('');
  const [email, setEmail] = useState('');

  const fetchChaptersAndMembers = async () => {
    const chaptersQuery = query(collection(db, "chapters"));
    const querySnapshot = await getDocs(chaptersQuery);
    const chaptersData = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const chapterData = doc.data();
      chapterData.id = doc.id;
      const membersSnapshot = await getDocs(collection(db, `chapters/${doc.id}/members`));
      chapterData.members = membersSnapshot.docs.map(memberDoc => ({ id: memberDoc.id, ...memberDoc.data() }));
      return chapterData;
    }));
    setChapters(chaptersData);
  };

  useEffect(() => {
    fetchChaptersAndMembers();
  }, []);

  const handleAddChapter = async () => {
    try {
      const docRef = await addDoc(collection(db, "chapters"), {
        name: name,
        location: location,
      });
      console.log("Chapter created with ID: ", docRef.id);
      setName('');
      setLocation('');
    } catch (e) {
      console.error("Error adding chapter: ", e);
    }
  };

  const handleAddMember = async () => {
    if (!chapterId) {
      alert("Please select a chapter.");
      return;
    }
    try {
      const memberRef = await addDoc(collection(db, `chapters/${chapterId}/members`), {
        name: memberName,
        email: email,
      });
      console.log("Member added with ID: ", memberRef.id);
      setMemberName('');
      setEmail('');
    } catch (e) {
      console.error("Error adding member: ", e);
    }
  };

  return (
    <div className="App">
      <div>
        <h2>Add Chapter</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter chapter name"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
        <button onClick={handleAddChapter}>
          Add Chapter
        </button>
      </div>
      <div>
        <h2>Add Member to Chapter</h2>
        <input
          value={chapterId}
          onChange={(e) => setChapterId(e.target.value)}
          placeholder="Chapter ID"
        />
        <input
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
          placeholder="Member Name"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Member Email"
        />
        <button onClick={handleAddMember}>
          Add Member
        </button>
      </div>

      <h2>Displaying Database:</h2>
      <div>
        {chapters.map(chapter => (
          <div key={chapter.id}>
            <p>Chapter: {chapter.name}</p>
            <p>ID: {chapter.id}</p>
            <p>Location: {chapter.location}</p>
            <table>
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {chapter.members.map(member => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
