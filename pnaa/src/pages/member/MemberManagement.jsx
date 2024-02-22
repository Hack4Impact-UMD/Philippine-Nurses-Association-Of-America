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

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
  ];

  return (
    <div>
      <h1>Member Management Page</h1>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Full Name</th>
          </tr>
        </thead>
        <tbody>
          {members.map(member => (
            <tr key={member.id}>
              <td>{member.id}</td>
              <td>{member.firstName}</td>
              <td>{member.lastName}</td>
              <td>{member.age}</td>
              <td>{`${member.firstName || ''} ${member.lastName || ''}`}</td>
              {/* Add other fields as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberManagement;