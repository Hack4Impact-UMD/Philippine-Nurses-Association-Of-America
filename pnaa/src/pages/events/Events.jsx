import React, {useState, useEffect} from 'react';
import { useUser } from '../../config/UserContext';
import { DataGrid } from '@mui/x-data-grid';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Select, MenuItem, Button } from '@mui/material';


const Events = () => {

  const { currentUser, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(''); // State to hold the selected chapter
  const [chapters, setChapters] = useState([]); // State to hold the list of chapters
  const navigate = useNavigate();


  useEffect(() => {
    const fetchEvents = async () => {
      const db = getFirestore();
      const eventsRef = collection(db, 'events');
      try {
        const snapshot = await getDocs(eventsRef);
        const eventsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setEvents(eventsList);
        const uniqueChapters = [...new Set(eventsList.map(event => event.chapter))];
        setChapters(uniqueChapters);

      } catch (error) {
        console.error("Error fetching events: ", error);
      } finally {
        setLoading(false);
      };
    }
    fetchEvents();
  }, [currentUser]);

  const filterEventsByChapter = () => {
    if (!selectedChapter) {
      setEvents(events);
    }
    else {
      const filteredEvents = events.filter(event => event.chapter === selectedChapter);
      setEvents(filteredEvents);
    }
  }
  
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

  const renderStatus = (status) => {
    if (status === "National") {
      return (
        <Status
          text="National"
          backgroundColor="#EBF0FA"
          textColor="blue"
          width="70px"
          height="20px"
          />
      );
    }
  };

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
  
  const exportRegistration = (
    <div style={{ marginRight: '10px'}}>
    <MemberButton
      text="+ Export Registration"
      backgroundColor={"#53A67E"}
      width="182px"
      height="32px"
    />
    </div>
  );

  const recordRegistration = (
    <div style={{ marginRight: '10px'}}>
    <MemberButton
      text="+ Record Event Registration"
      backgroundColor={"#05208B"}
      width="229px"
      height="32px"
    />
    </div>
  );

  const columns = [
    { field: 'name', headerName: 'EVENT NAME', width: 300 },
    { field: 'date', headerName: 'DATE', width: 100 },
    { field: 'time', headerName: 'TIME', width: 125 },
    { field: 'location', headerName: 'LOCATION', width: 150 },
    { field: 'status', headerName: 'STATUS', width: 150, renderCell: (params) => (renderStatus(params.status))},
    { field: 'attendee#', headerName: 'ATTENDEE #', width: 125},
    { field: 'contact hrs', headerName: 'CONTACT HRS', width: 125},
    { field: 'volunteer#', headerName: 'VOLUNTEER #', width: 125},
    { field: 'participants_served', headerName: 'PARTICIPANTS SERVED', width: 200 },
  ];

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const handleRowClick = (params) => {
    navigate(`/chapter-dashboard/member-detail/`, { state: { member: params.row } });
  };

  const handleFilterByChapter = (selectedChapter) => {
    setSelectedChapter(selectedChapter);
    
    if (!selectedChapter) {
      // If no chapter is selected, reset events to show all events
      setEvents(events);
    } else {
      // Filter events based on selected chapter
      const filteredEvents = events.filter(event => event.chapter === selectedChapter);
      setEvents(filteredEvents);
    }
  };

  return (
    <div>
      <div>
        <h1>Events</h1>
        <div>
          <label htmlFor="chapterSelect">Select Chapter:</label>
          <select id="chapterSelect" value={selectedChapter} onChange={(e) => handleFilterByChapter(e.target.value)}>
            <option value="">All Chapters</option>
            {chapters.map((chapter, index) => (
              <option key={index} value={chapter}>{chapter}</option>
            ))}
          </select>
          {exportRegistration}
          {recordRegistration}
        </div>
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