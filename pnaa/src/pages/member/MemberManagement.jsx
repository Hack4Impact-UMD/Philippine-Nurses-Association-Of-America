import React, { useState, useEffect } from 'react';
import { useUser } from '../../config/UserContext';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const MemberManagement = () => {
  const { currentUser, loading: userLoading } = useUser();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);


  //Fetches all member data within chapter
  useEffect(() => {
    if (currentUser?.chapterId) {
      const fetchMembers = async () => {
        const db = getFirestore();
        const membersRef = collection(db, 'chapters', currentUser.chapterId, 'members');

        try {
          const snapshot = await getDocs(membersRef);
          const membersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log(membersList);
          setMembers(membersList);
        } catch (error) {
          console.error("Error fetching members:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchMembers();
    }
  }, [currentUser]);

  if (userLoading || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Member Management Page</h1>
      <div>
        <h2>Members</h2>
        <ul>
          {members.map(member => (
            <li key={member.id}>
              {/* Passes member data as parameter to MemberDetails */}
              <Link to={`/chapter-dashboard/member-detail/`} state={{ member: member }}>
                {member.FirstName} {member.LastName}
              </Link>
              {/* Other Fields */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MemberManagement;