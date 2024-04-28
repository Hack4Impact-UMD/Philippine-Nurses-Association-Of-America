import React from 'react';
import { useUser} from '../../config/UserContext';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import InfoIcon from '@mui/icons-material/Info';
import ModeIcon from '@mui/icons-material/Mode';
import ArchiveIcon from '@mui/icons-material/Archive';
import { useState, useEffect } from 'react';

const Fundraising = () => {
  const [donations, setDonations] = useState([]);
  const [originalDonations, setOriginalDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser, loading: userLoading } = useUser();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (searchTerm === '') {
      setDonations(originalDonations);
    } else {
      const filteredDonations = donations.filter(event => 
        event.Name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setDonations(filteredDonations);
    }
  };

  useEffect(() => {
    if (currentUser?.chapterId) {
      const fetchDonations = async () => {
        const db = getFirestore();
        const donations = collection(db, 'fundraisers');

        try {
          const snapshot = await getDocs(donations);
          const donationsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log(donationsList);
          console.log("Lol");
          setDonations(donationsList);
          setOriginalDonations(donationsList);
        } catch (error) {
          console.error("Donations not found error:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchDonations();
    }
  }, [currentUser]);

  

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
      <div style={styles.DonationButton}>
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
      />
    </div>
  );

  const DetailsMember = (
    <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
      <DonationButton
         text={
          <>
            Details <InfoIcon style={{ marginLeft: '5px', color: 'blue', fontSize: '1rem' }} />
          </>
        }
        backgroundColor={"lightblue"}
        width="170px"
        height="32px"
      />
    </div>
  );

  const EditMember = (
    <div style={{ marginRight: '10px' }}>
      <DonationButton
         text={
          <>
            Edit <ModeIcon style={{ marginLeft: '5px', color: 'blue', fontSize: '1rem' }} />
          </>
        }
        backgroundColor={"lightblue"}
        width="156px"
        height="32px"
      />
    </div>
  )

  const ArchiveMember = (
    <div style={{ marginRight: '10px' }}>
      <DonationButton
        text={
          <>
            Archive <ArchiveIcon style={{ marginLeft: '5px', color: 'red', fontSize: '1rem' }} />
          </>
        }
        backgroundColor={"#AB2218"}
        width="156px"
        height="32px"
      />
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
    }
  ];
  

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const navigateToFundraiserDetails = (fundraiser) => {
    navigate(`/chapter-dashboard/fundraising-detail/`, { state: { fundraiser } });
  };

  return (
    <div>
      <div style={{ height: '80%', width: '100%', margin: '0 auto' }}> 
        <h1> Total Amount: $34,783 </h1>
        <input
          type="text"
          placeholder="Search by donation name"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', marginBottom: '10px', marginRight: '50px' }}>
          {selectedRows.length === 0 && AddDonation}
          {selectedRows.length !== 0 && DetailsMember}
          {selectedRows.length !== 0 && EditMember}
          {selectedRows.length !== 0 && ArchiveMember}
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