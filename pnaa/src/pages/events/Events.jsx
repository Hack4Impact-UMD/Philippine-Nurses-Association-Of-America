import React, {useState, useEffect} from 'react';
import { useUser } from '../../config/UserContext';
import { DataGrid } from '@mui/x-data-grid';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Events = () => {

  const { currentUser, loading } = useUser();
  const [events, setEvents] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchEvents = async () => {
      const db = getFirestore();
      const eventsRef = collection(db, 'events');
      try {
        const snapshot = await getDocs(eventsRef);
        const eventsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setEvents(eventsList);
      } catch (error) {
        console.error("Error fetching events: ", error);
      } finally {
        loading(false);
      };

      fetchEvents();
    }
  }, [currentUser]);
  
  if (loading) { 
    return <div>Loading...</div>;
  }

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

  const columns = [
    { field: 'name', headerName: 'EVENT NAME', width: 75 },
    { field: 'date', headerName: 'DATE', width: 275 },
    { field: 'time', headerName: 'TIME', width: 250 },
    { field: 'location', headerName: 'LOCATION', width: 150 },
    { field: 'status', headerName: 'STATUS', width: 150},
    { field: 'attendee#', headerName: 'ATTENDEE #', width: 150},
    { field: 'contact hrs', headerName: 'CONTACT HRS', width: 150},
    { field: 'volunteer#', headerName: 'VOLUNTEER #', width: 225},
    { field: 'participants_served', headerName: 'PARTICIPANTS SERVED', width: 150 },
  ];

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const handleRowClick = (params) => {
    navigate(`/chapter-dashboard/member-detail/`, { state: { member: params.row } });
  };

  return (
    <div>
      <div>
        <h1>Events</h1>
        <div>
        <DataGrid
          rows={events}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          onRowSelectionModelChange={handleSelectionChange}
          onRowClick={handleRowClick} // Add the onRowClick event handler
          columnHeaderHeight={100}
          sx={{
            border: 10,
            borderColor: '#E0E0E0',
            borderRadius: 0,
            '& .MuiDataGrid-row:nth-child(even)': {
              backgroundColor: '#E0E0E0'
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
    
    </div>
  );
};



export default Events;