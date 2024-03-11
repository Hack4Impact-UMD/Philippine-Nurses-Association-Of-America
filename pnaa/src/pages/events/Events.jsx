import React from 'react';
import { useUser } from '../../config/UserContext';

const Status = ({ text, backgroundColor, textColor, width, height }) => {
  const styles = {
    status: {
      backgroundColor: backgroundColor,
      color: textColor,
      width: width,
      height: height,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '10px',
    },
  };

  return (
    <div style={styles.status}>
      {text}
    </div>
  );
}

const MemberButton = ({ text, backgroundColor, width, height }) => {
  const styles = {
    memberButton: {
      backgroundColor: backgroundColor,
      color: 'white',
      width: width,
      height: height,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '6px',
    },
  };

  return (
    <div style={styles.memberButton}>
      {text}
    </div>
  );
}

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