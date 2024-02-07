import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-config';

const Home = () => {

  const navigate = useNavigate(); 

  const signOut = () => {
    auth.signOut();
    console.log("Signed out");
    navigate('/');
  };

  return (
    <div>
      <h1>Welcome To Chapter Dashboards</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

export default Home;
