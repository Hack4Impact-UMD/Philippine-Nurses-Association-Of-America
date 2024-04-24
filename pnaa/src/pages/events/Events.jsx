import { useState, useEffect } from "react";
import { useUser } from "../../config/UserContext";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import {  useNavigate } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import Papa from 'papaparse';


const Events = () => {
  const { currentUser, loading: userLoading } = useUser();

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  const [originalEvents, setOriginalEvents] = useState([]);
  const [originalRegions, setOriginalRegions] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(''); // State to hold the selected chapter
  const [selectedRegion, setSelectedRegion] = useState('');
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
        setOriginalEvents(eventsList);
        const uniqueRegions = [...new Set(eventsList.filter(event => event.region != null).map(event => event.region))];
        setOriginalRegions(uniqueRegions);

      } catch (error) {
        console.error("Error fetching events: ", error);
      } finally {
        setLoading(false);
      };
    }
    fetchEvents();
  }, [currentUser]);

  useEffect(() => {
    const fetchChapters = async () => {
      const db = getFirestore();
      const chaptersRef = collection(db, 'chapters');
      try {
        const snapshot = await getDocs(chaptersRef);
        const chapterNames = snapshot.docs.map(doc => doc.data().name);
        setChapters(chapterNames);
      } catch (error) {
        console.error("Error fetching chapters: ", error);
      }
    }
    fetchChapters();
  }, []);


  if (loading || userLoading) {

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

  const renderStatus = (status, chapter) => {
    if (status === "National") {
      return (
        <Status
          text="National"
          backgroundColor="#EBF0FA"
          textColor="blue"
          width="132px"
          height="20px"
        />
      );
    } else if (status === "Chapter") {
      return (
        <Status
          text={chapter}
          backgroundColor="#FCF2E6"
          textColor="brown"
          width="132px"
          height="20px"
        />
      )
    } else {
      return (
        <Status
          text="Non-Chapter"
          backgroundColor="#FAF0F3"
          textColor='red'
          width="132px"
          height="20px"
        />
      )
    }
  };

  const MemberButton = ({ text, backgroundColor, width, height, onClick }) => {
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
        cursor: 'pointer'
      },
    };

    return (
      <div style={styles.memberButton} onClick={onClick}>
        {text}
      </div>
    );
  }

  const handleExport = () => {
    // Retrieve full event details for each selected row
    const selectedEvents = selectedRows.map(rowId => events.find(event => event.id === rowId));
    console.log("ev", selectedEvents);
    const fields = ['name', 'chapter', 'date', 'time', 'location', 'status', 'attendee#', 'contact hrs', 'volunteer#', 'participants_served', 'region', 'about', 'other_details'];
    // Convert selected events to CSV using Papaparse
    const csvData = Papa.unparse({
      fields: fields,
      data: selectedEvents
    });

    if (csvData) {
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

      // Create a link and trigger the download
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "events.csv");
      document.body.appendChild(link); // Required for FF
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Nothing Selected");
    }
  }

  const exportRegistration = (
    <div style={{ marginRight: '10px' }}>
      <MemberButton
        text="+ Export Registration"
        backgroundColor={"#53A67E"}
        width="182px"
        height="32px"
        onClick={handleExport}
      />
    </div>
  );

  const handleAddEvent = () => {
    console.log("afsdf");
    navigate("/chapter-dashboard/event-details", { state: { event: null } });
  };

  const recordRegistration = (
    <div style={{ marginRight: '10px' }}>
      <MemberButton
        text="+ Record Event Registration"
        backgroundColor={"#05208B"}
        width="229px"
        height="32px"
        onClick={handleAddEvent} // Pass handleAddEvent function as an onClick prop
      />
    </div>
  );

  const columns = [
    {
      field: 'name',
      headerName: 'EVENT NAME',
      width: 250,
      renderCell: (params) => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => handleRowClick(params)}
        >
          {params.value}
        </div>
      ),
    },
    { field: 'date', headerName: 'DATE', width: 100, cellClassName: 'cell' },
    { field: 'time', headerName: 'TIME', width: 125, cellClassName: 'cell' },
    { field: 'location', headerName: 'LOCATION', width: 150, cellClassName: 'cell' },
    { field: 'status', headerName: 'STATUS', width: 200, renderCell: (params) => (renderStatus(params.value, params.row.chapter)) },
    { field: 'attendee#', headerName: 'ATTENDEE #', width: 125, cellClassName: 'cell' },
    { field: 'contact hrs', headerName: 'CONTACT HRS', width: 125, cellClassName: 'cell' },
    { field: 'volunteer#', headerName: 'VOLUNTEER #', width: 125, cellClassName: 'cell' },
    { field: 'participants_served', headerName: 'PARTICIPANTS SERVED', width: 200, cellClassName: 'cell' },
  ];

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const handleRowClick = (params) => {
    navigate("/chapter-dashboard/event-details", { state: { event: params.row } });
  };

  const handleFilterByChapter = (selectedChapter) => {
    setSelectedChapter(selectedChapter);

    if (!selectedChapter || selectedChapter === "All Chapters") {
      setEvents(originalEvents);
      setSelectedRegion('');
    } else if (selectedChapter === "Unarchived Events") {
      setEvents(originalEvents.filter(event => event.archived === false || event.archived == null));
    } else if (selectedChapter === "Archived Events") {
      setEvents(originalEvents.filter(event => event.archived === true));
    } else {
      let filteredEvents = originalEvents.filter(event => event.chapter === selectedChapter);

      // If a region is selected, further filter the events based on the selected region
      if (selectedRegion) {
        filteredEvents = filteredEvents.filter(event => event.region === selectedRegion);
      }

      setEvents(filteredEvents);
    }
  };

  const handleFilterByRegion = (selectedRegion) => {
    setSelectedRegion(selectedRegion);

    if (!selectedRegion) {
      setEvents(originalEvents);
      setSelectedChapter('')
    } else {
      let filteredEvents = originalEvents.filter(event => event.region === selectedRegion);

      // If a chapter is selected, further filter the events based on the selected chapter
      if (selectedChapter) {
        filteredEvents = filteredEvents.filter(event => event.chapter === selectedChapter);
      }

      setEvents(filteredEvents);
    }
  };

  return (
    <div>
      <div>
        <h1>Events</h1>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginRight: 'auto', padding: '10px' }}>
            <label id="filterlabel" htmlFor="chapterSelect">Filter By Chapter or Archived: </label>
            <select id="chapterSelect" value={selectedChapter} onChange={(e) => handleFilterByChapter(e.target.value)}>
              <option value="">All Events</option>
              <option value="Unarchived Events">Unarchived Events</option>
              <option value="Archived Events">Archived Events</option>
              {chapters.map((chapter, index) => (
                <option key={index} value={chapter}>{chapter}</option>
              ))}
            </select>
            <label id="filterRegion" htmlFor='regionSelect'> Select Region: </label>
            <select id='regionSelect' value={selectedRegion} onChange={(e) => handleFilterByRegion(e.target.value)}>
              <option value="">All Regions</option>
              {originalRegions.map((region, index) => (
                <option key={index} value={region}>{region}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', padding: '5px' }}>
            {exportRegistration}
            {recordRegistration}
          </div>
        </div>
        <div id="table-background">
          <DataGrid
            rows={events}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection
            onRowSelectionModelChange={handleSelectionChange}
            columnHeaderHeight={100}
            sx={{
              border: 10,
              borderColor: 'rgba(189,189,189,0.75)',
              borderRadius: 4,
              '& .MuiDataGrid-row:nth-child(even)': {
                backgroundColor: "rgba(224, 224, 224, 0.75)"

              },
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: "rgba(224, 224, 224, 0.75)"
              },
              '& .MuiDataGrid-row:nth-child(odd)': {
                backgroundColor: '#FFFFFF'
              },
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: "rgba(224, 224, 224, 0.75)"
              }
            }}
          />
        </div>

      </div>
    </div>
  );
};


export default Events;



