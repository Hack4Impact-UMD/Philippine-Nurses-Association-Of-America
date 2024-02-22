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

  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];

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