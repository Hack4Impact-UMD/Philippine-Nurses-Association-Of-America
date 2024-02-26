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

  //Generic component definition to create the icons for the "status" column
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

  //Generic component definition to create the buttons for add, suspend, and renew member (need to add onClick functionality later)
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

  //Button for "Add Member" created using MemberButton
  const AddMember = (
    <div style={{ marginRight: '10px'}}>
      <MemberButton
        text="+ Add Member"
        backgroundColor={"#05208B"}
        width="139px"
        height="32px"
      />
    </div>
  );

  const columns = [
    { field: '#', headerName: '#', width: 75 },
    { field: 'name', headerName: 'NAME', width: 275, valueGetter: (params) => params.row.id },
    { field: 'membership-level', headerName: 'MEMBERSHIP LEVEL', width: 250, renderCell: (params) => ( <Status text="Active Member (1 year)" backgroundColor={"#EBF0FA"} textColor="blue" width="163px" height="20px"/> ) },
    { field: 'status', headerName: 'STATUS', width: 150, renderCell: (params) => ( <Status text="Active" backgroundColor={"#E1FCEF"} textColor="green" width="58px" height="20px"/> ) },
    { field: 'registration', headerName: 'REGISTRATION', width: 150},
    { field: 'renewal', headerName: 'RENEWAL', width: 150},
    { field: 'renewal-due', headerName: 'RENEWAL DUE', width: 150},
    { field: 'level-last-updated', headerName: 'LEVEL LAST UPDATED', width: 225},
  ];

  return (
    <div>
      <h1>Member Management Page</h1>
      <div style={{ height: '80%', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          {AddMember}
        </div>
        <DataGrid
          rows={members}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          columnHeaderHeight={100}
          headerRight={AddMember}
          sx={{
            border: 10,
            borderColor: '#E0E0E0',
            borderRadius: 0,
            '& .MuiDataGrid-row:nth-child(even)': {
              backgroundColor: '#BDBDBD'
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#BDBDBD',
            },
            '& .MuiDataGrid-row:nth-child(odd)': {
              backgroundColor: '#FFFFFF'
            },
          }}
        />
      </div>
    </div>
  );
};

export default MemberManagement;