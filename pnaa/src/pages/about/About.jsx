import React from 'react';
import { useUser } from '../../config/UserContext';

const About = () => {
  const { currentUser, loading } = useUser();
  
  if (loading) { 
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>About Page</h1>
      <h2>Chapter Information</h2>
      {currentUser.chapterData && (
        <>
          <p>Chapter Name: {currentUser.chapterData.name}</p>
          <p>MemberCount: {currentUser.chapterData.memberCount}</p>
          <p>Location: {currentUser.chapterData.location}</p>
        </>
      )}
    </div>
  );
};

export default About;
