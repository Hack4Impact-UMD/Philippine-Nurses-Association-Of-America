import React from 'react';
import { useUser} from '../../config/UserContext';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, loading: userLoading } = useUser();

  useEffect(() => {
    if (currentUser?.chapterId) {
      const fetchDonations = async () => {
        const db = getFirestore();
        const donations = collection(db, 'chapters', currentUser.chapterId, 'donations');

        try {
          const snapshot = await getDocs(donations);
          const donationsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log(donationsList);
          setDonations(donationsList);
        } catch (error) {
          console.error("Donations not found error:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchDonations();
    }
  }, [currentUser]);

  
  
  if (loading) { 
    return <div>Loading your donations...</div>;
  }

  return (
    <div>
      <h1>Donations Page</h1>
      <p>TBD.</p>
    </div>
  );
};

export default Donations;