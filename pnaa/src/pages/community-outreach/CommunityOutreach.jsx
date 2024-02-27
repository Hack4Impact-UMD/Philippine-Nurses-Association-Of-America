import React from 'react';
import { useUser } from '../../config/UserContext';

const CommunityOutreach = () => {

  const { currentUser, loading } = useUser();
  
  if (loading) { 
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Community Outreach Page</h1>
      <p>TBD.</p>
    </div>
  );
};

export default CommunityOutreach;