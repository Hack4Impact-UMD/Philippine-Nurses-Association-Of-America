import React from 'react';
import { useUser } from '../../config/UserContext';

const Events = () => {

  const { currentUser, loading } = useUser();
  
  if (loading) { 
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Events Page</h1>
      <p>TBD.</p>
    </div>
  );
};

export default Events;