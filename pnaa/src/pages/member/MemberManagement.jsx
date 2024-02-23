import React, { useState, useEffect } from 'react';
import { useUser } from '../../config/UserContext';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import './MemberManagement.css';

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
    { field: '#', headerName: '#', width: 150 },
    { field: 'name', headerName: 'NAME', width: 150},
    { field: 'membership-level', headerName: 'MEMBERSHIP LEVEL', width: 150},
    { field: 'status', headerName: 'STATUS', width: 150},
    { field: 'registration', headerName: 'REGISTRATION', width: 150},
    { field: 'renewal', headerName: 'RENEWAL', width: 150},
    { field: 'renewal-due', headerName: 'RENEWAL DUE', width: 150},
    { field: 'level-last-updated', headerName: 'LEVEL LAST UPDATED', width: 150},
  ];

  return (
    <div>
      <h1>Member Management Page</h1>
      <div style={{ height: '80%', width: '100%' }}>
        <DataGrid
          rows={members}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
        />
      </div>
    </div>
  );
};

export default MemberManagement;