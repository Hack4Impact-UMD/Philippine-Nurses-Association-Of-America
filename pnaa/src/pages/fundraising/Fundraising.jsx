import React from 'react';
import { useUser} from '../../config/UserContext';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import InfoIcon from '@mui/icons-material/Info';
import ModeIcon from '@mui/icons-material/Mode';
import ArchiveIcon from '@mui/icons-material/Archive';
import { useState, useEffect } from 'react';
import styles from './fundraising.module.css';
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../config/firebase.ts";
import { fetchSignInMethodsForEmail } from 'firebase/auth';

const Fundraising = () => {
  const [donations, setDonations] = useState([]);

  const [origDonations, setOrigDonations] = useState([]);
  const [displayDonations, setDisplayDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalDonations, setTotalDonations] = useState(0);
  const {currentUser, loading: userLoading } = useUser();
  const [selectedChapter, setSelectedChapter] = useState("");
  const [chapters, setChapters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [del, setDel] = useState(false);


  


  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if(value === '' && !selectedChapter){
      setDonations(origDonations);
      calculateTotal(origDonations);
    }
    else if (value === '') {
      let filteredDonations = origDonations.filter(donation => donation.ChapterName === selectedChapter);
      setDonations(filteredDonations);
      calculateTotal(filteredDonations);
      
    } else {
      const filteredDonations = origDonations.filter(donation => 
        donation.Name.toLowerCase().includes(value.toLowerCase())
      );

      if(selectedChapter){

      
      const finalFiltered = filteredDonations.filter(
        donation => donation.ChapterName === selectedChapter
      );

      setDonations(finalFiltered);
      calculateTotal(finalFiltered);
    }else{
      setDonations(filteredDonations);
      calculateTotal(filteredDonations);

    }

  }
  };


  useEffect(() => {
    
      const fetchDonations = async () => {
        const db = getFirestore();
        const donations = collection(db, 'fundraisers');

        try {
          const snapshot = await getDocs(donations);
          const donationsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log(donationsList);
          setDonations(donationsList);

          setOrigDonations(donationsList);
          let i = 0;
          let total = 0;
          while(i < donationsList.length){
            total = total + Number(donationsList[i].Amount);
            console.log(total);
            i++;
          }
          setTotalDonations(total);

         

        } catch (error) {
          console.error("Donations not found error:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchDonations();
    
  }, [currentUser, del]);



  const calculateTotal = (donations) => {
    let i = 0;
    let total = 0;
    while(i < donations.length){
      total = total + Number(donations[i].Amount);
      console.log(total);
      i++;
    }
    setTotalDonations(total);
   
    
  };


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

  const handleAddFundraising = () => {
    navigate("add-fundraising");
    console.log("ok");
  }

  const handleDeleteFundraising = async () => {
    if (selectedRows.length === 0) {
      alert("No fundraiser selected. Please select fundraisers to delete.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected fundraiser events?"
    );

    if (confirmDelete) {
      const fundraisersRef = collection(db, "fundraisers");
      try {
        for (const fundraiserId of selectedRows) {
          const fundraiserRef = doc(fundraisersRef, fundraiserId);
          await deleteDoc(fundraiserRef);
        }
    
        setSelectedRows([]);
     
        alert("Selected fundraisers deleted successfully!");
        setDel(!del);
      } catch (error) {
        console.error("Error deleting fundraisers: ", error);
        alert("An error occurred while deleting fundraisers. Please try again.");
      }
    }
  };
  


  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();




  if (userLoading || loading) {
    return <div>Loading...</div>;
  }

  //Generic component definition to create the icons for the "status" column
  const Status = ({ text, backgroundColor, textColor, width, height, fontWeight}) => {
    const styles = {
      status: {
        backgroundColor: backgroundColor,
        color: textColor,
        width: width,
        height: height,
        display: 'flex',
        justifyContent: 'left',
        alignItems: 'left',
        borderRadius: '50px',
      },
    };

    return (
      <div style={styles.status}>
        {text}
      </div>
    );
  }

  //Generic component definition to create the buttons for add, suspend, and renew member (need to add onClick functionality later)
  const DonationButton = ({ text, backgroundColor, width, height}) => {
    const styles = {
      DonationButton: {
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
      <div style={styles.DonationButton} onClick={handleAddFundraising}>
        {text}
      </div>
    );
  }

  //Button for "Add Donation" created using DonationButton
  const AddDonation = (
    <div style={{ marginRight: '10px'}}>
      <DonationButton
        text="+ Add Donation"
        backgroundColor={"#05208B"}
        width="139px"
        height="32px"
        onClick={handleAddFundraising}
      />
    </div>
  );


  const DeleteFundraising = (
    <div style={{ marginRight: '10px' }}>
      <button
         class={styles.button}
      
        onClick={handleDeleteFundraising}
        > Delete </button>
    </div>
  )

  

  const columns = [
    {
      field: 'name',
      headerName: 'NAME',
      width: 200,
      renderCell: (params) => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => navigateToFundraiserDetails(params.row)}
        >
          {params.row.Name}
        </div>
      ),
    },
    { 
      field: 'Date', 
      headerName: 'DATE', 
      width: 200, 
      renderCell: (params) => (
       
        <div
        style={{ cursor: 'pointer' }}
        onClick={() => navigateToFundraiserDetails(params.row)}
      >
        {params.row.Date}
        </div>) 
    },
    { 
      field: 'Type', 
      headerName: 'TYPE', 
      width: 250, 
      renderCell: (params) => ( 
        <Status text="Event" backgroundColor={"#EBF0FA"} textColor="blue" width="40px" height="20px"/> 
      ) 
    },
    { 
      field: 'Amount', 
      headerName: 'AMOUNT', 
      width: 150, 
      renderCell: (params) => (
       
        <div
        style={{ cursor: 'pointer' }}
        onClick={() => navigateToFundraiserDetails(params.row)}
      >
        {"$" + params.row.Amount}
      </div> 
      ) 
    },
    { 
      field: 'Status', 
      headerName: 'STATUS', 
      width: 200, 
      renderCell: (params) => ( 
        <Status text="Completed" backgroundColor={"#E1FCEF"} textColor="green" width="80px" height="20px"/> 
      
      ) 
    },
    { 
      field: 'Note', 
      headerName: 'NOTE', 
      width: 250, 
      renderCell: (params) => ( 
        <div
        style={{ cursor: 'pointer' }}
        onClick={() => navigateToFundraiserDetails(params.row)}
      >
        {params.row.Note}
      </div> 
      ) 
    },
    { 
      field: 'Chapter Name', 
      headerName: 'Chapter Name', 
      width: 250, 
      renderCell: (params) => ( 
        <div
        style={{ cursor: 'pointer' }}
        onClick={() => navigateToFundraiserDetails(params.row)}
      >
        {params.row.ChapterName}
      </div> 
      ) 
    }
  ];
  

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };



  const handleFilterByChapter = (selectedChapter) => {
    setSelectedChapter(selectedChapter);
    // if there is no filter applied
    
    if (!selectedChapter && searchTerm === '') {
      setDonations(origDonations);
      calculateTotal(origDonations);
      
      
    } else if(!selectedChapter){
      const filteredDonations = origDonations.filter(donation => 
        donation.Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDonations(filteredDonations);
      calculateTotal(filteredDonations);


    }
    
    else {
    
      let filteredDonations = origDonations.filter(donation => donation.ChapterName === selectedChapter);
      const finalDonations = filteredDonations.filter(donation => 
        donation.Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDonations(finalDonations);
      calculateTotal(finalDonations);

      
     
      
    }
    

  }

  const navigateToFundraiserDetails = (fundraiser) => {
    navigate(`fundraising-detail`, { state: { fundraiser } });
  };

  return (
    <div>
      <div style={{ height: '80%', width: '100%', margin: '0 auto' }}> 


        <h1> Total Amount: ${totalDonations} </h1>
        <label>Search by fundraising event name: </label>
        <input
          type="text"
          id = {styles.searchBar}

          placeholder="Search by donation name"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', marginBottom: '10px', marginRight: '50px' }}>
          {selectedRows.length === 0 && AddDonation}
          {selectedRows.length !== 0 && DeleteFundraising}
        </div>
        <div class={styles.finders}>

        
        <label  id={styles.filterlabel} htmlFor="chapterSelect">Filter by Chapter Name:</label>
            <select id={styles.chapterSelect} value={selectedChapter} onChange={(e) => handleFilterByChapter(e.target.value)}>
              <option value="">All Chapters</option>
              {chapters.map((chapter, index) => (
                <option key={index} value={chapter}>{chapter}</option>
              ))}
            </select>
            </div>
        <div style={{ margin: '0 50px' }}>
          <DataGrid
            header = {"Total Amount: $1000"}
            rows={donations}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection
            onRowSelectionModelChange={handleSelectionChange}
            columnHeaderHeight={100}
            sx={{
              border: 13,
              borderColor: '#d9d9d9',
              borderRadius: 2,
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

export default Fundraising;