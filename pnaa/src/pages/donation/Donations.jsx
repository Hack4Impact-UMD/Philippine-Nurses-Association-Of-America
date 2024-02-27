import React from 'react';
import { useUser } from '../../config/UserContext';

const Donations = () => {

  const { currentUser, loading } = useUser();
  
  if (loading) { 
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Donations Page</h1>
      <p>TBD.</p>
    </div>
  );
};

export default Donations;