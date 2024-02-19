import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { useUser } from '../../config/UserContext';

const Home = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate(); 

  const signOut = () => {
    auth.signOut();
    console.log("Signed out");
    navigate('/');
  };

  return (
    <div>
      <h1>Welcome To Chapter Dashboards</h1>
      <p>You can now fetch the user id from anywhere in the app now!!! {currentUser.uid}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

export default Home;
