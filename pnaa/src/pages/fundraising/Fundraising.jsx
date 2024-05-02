import ArchiveIcon from "@mui/icons-material/Archive";
import InfoIcon from "@mui/icons-material/Info";
import ModeIcon from "@mui/icons-material/Mode";
import { DataGrid } from "@mui/x-data-grid";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import styles from "./fundraising.module.css";

const Fundraising = () => {
  const [donations, setDonations] = useState([]);
  const [origDonations, setOrigDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalDonations, setTotalDonations] = useState(0);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchDonations = async () => {
      const db = getFirestore();
      const donations = collection(db, "fundraisers");

      try {
        const snapshot = await getDocs(donations);
        const donationsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(donationsList);
        console.log("Lol");
        setDonations(donationsList);
        setOrigDonations(donationsList);
        let i = 0;
        let total = 0;
        while (i < donationsList.length) {
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
  }, []);

  const calculateTotal = (donations) => {
    let i = 0;
    let total = 0;
    while (i < donations.length) {
      total = total + Number(donations[i].Amount);
      console.log(total);
      i++;
    }
    setTotalDonations(total);
  };

  useEffect(() => {
    const fetchChapters = async () => {
      const db = getFirestore();
      const chaptersRef = collection(db, "chapters");
      try {
        const snapshot = await getDocs(chaptersRef);
        const chapterNames = snapshot.docs.map((doc) => doc.data().name);
        setChapters(chapterNames);
      } catch (error) {
        console.error("Error fetching chapters: ", error);
      }
    };
    fetchChapters();
  }, []);

  const handleAddFundraising = () => {
    navigate("../add-fundraising");
    console.log("ok");
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }

  //Generic component definition to create the icons for the "status" column
  const Status = ({
    text,
    backgroundColor,
    textColor,
    width,
    height,
    fontWeight,
  }) => {
    const styles = {
      status: {
        backgroundColor: backgroundColor,
        color: textColor,
        width: width,
        height: height,
        display: "flex",
        justifyContent: "left",
        alignItems: "left",
        borderRadius: "50px",
      },
    };

    return <div style={styles.status}>{text}</div>;
  };

  //Generic component definition to create the buttons for add, suspend, and renew member (need to add onClick functionality later)
  const DonationButton = ({ text, backgroundColor, width, height }) => {
    const styles = {
      DonationButton: {
        backgroundColor: backgroundColor,
        color: "white",
        width: width,
        height: height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "6px",
      },
    };

    return (
      <div style={styles.DonationButton} onClick={handleAddFundraising}>
        {text}
      </div>
    );
  };

  //Button for "Add Donation" created using DonationButton
  const AddDonation = (
    <div style={{ marginRight: "10px" }}>
      <DonationButton
        text="+ Add Donation"
        backgroundColor={"#05208B"}
        width="139px"
        height="32px"
        onClick={handleAddFundraising}
      />
    </div>
  );

  const DetailsMember = (
    <div style={{ display: "flex", alignItems: "center", marginRight: "10px" }}>
      <DonationButton
        text={
          <>
            Details{" "}
            <InfoIcon
              style={{ marginLeft: "5px", color: "blue", fontSize: "1rem" }}
            />
          </>
        }
        backgroundColor={"lightblue"}
        width="170px"
        height="32px"
      />
    </div>
  );

  const EditMember = (
    <div style={{ marginRight: "10px" }}>
      <DonationButton
        text={
          <>
            Edit{" "}
            <ModeIcon
              style={{ marginLeft: "5px", color: "blue", fontSize: "1rem" }}
            />
          </>
        }
        backgroundColor={"lightblue"}
        width="156px"
        height="32px"
      />
    </div>
  );

  const ArchiveMember = (
    <div style={{ marginRight: "10px" }}>
      <DonationButton
        text={
          <>
            Archive{" "}
            <ArchiveIcon
              style={{ marginLeft: "5px", color: "red", fontSize: "1rem" }}
            />
          </>
        }
        backgroundColor={"#AB2218"}
        width="156px"
        height="32px"
      />
    </div>
  );

  const columns = [
    {
      field: "name",
      headerName: "NAME",
      width: 200,
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => navigateToFundraiserDetails(params.row)}
        >
          {params.row.Name}
        </div>
      ),
    },
    {
      field: "Date",
      headerName: "DATE",
      width: 200,
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => navigateToFundraiserDetails(params.row)}
        >
          {params.row.Date}
        </div>
      ),
    },
    {
      field: "Type",
      headerName: "TYPE",
      width: 250,
      renderCell: (params) => (
        <Status
          text="Event"
          backgroundColor={"#EBF0FA"}
          textColor="blue"
          width="40px"
          height="20px"
        />
      ),
    },
    {
      field: "Amount",
      headerName: "AMOUNT",
      width: 150,
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => navigateToFundraiserDetails(params.row)}
        >
          {"$" + params.row.Amount}
        </div>
      ),
    },
    {
      field: "Status",
      headerName: "STATUS",
      width: 200,
      renderCell: (params) => (
        <Status
          text="Completed"
          backgroundColor={"#E1FCEF"}
          textColor="green"
          width="80px"
          height="20px"
        />
      ),
    },
    {
      field: "Note",
      headerName: "NOTE",
      width: 250,
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => navigateToFundraiserDetails(params.row)}
        >
          {params.row.Note}
        </div>
      ),
    },
    {
      field: "Chapter Name",
      headerName: "Chapter Name",
      width: 250,
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => navigateToFundraiserDetails(params.row)}
        >
          {params.row.ChapterName}
        </div>
      ),
    },
  ];

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const handleFilterByChapter = (selectedChapter) => {
    setSelectedChapter(selectedChapter);
    // if there is no filter applied

    if (!selectedChapter) {
      setDonations(origDonations);
      calculateTotal(origDonations);
    } else {
      let filteredDonations = origDonations.filter(
        (donation) => donation.ChapterName === selectedChapter
      );

      setDonations(filteredDonations);
      calculateTotal(filteredDonations);
    }
  };

  const navigateToFundraiserDetails = (fundraiser) => {
    navigate(`fundraising-detail`, { state: { fundraiser } });
  };

  return (
    <div>
      <div style={{ height: "80%", width: "100%", margin: "0 auto" }}>
        <h1> Total Amount: ${totalDonations} </h1>
        <NavigationBar />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "40px",
            marginBottom: "10px",
            marginRight: "50px",
          }}
        >
          {selectedRows.length === 0 && AddDonation}
          {selectedRows.length !== 0 && DetailsMember}
          {selectedRows.length !== 0 && EditMember}
          {selectedRows.length !== 0 && ArchiveMember}
        </div>
        <label id={styles.filterlabel} htmlFor="chapterSelect">
          Filter by Chapter Name:
        </label>
        <select
          id={styles.chapterSelect}
          value={selectedChapter}
          onChange={(e) => handleFilterByChapter(e.target.value)}
        >
          <option value="">All Chapters</option>
          {chapters.map((chapter, index) => (
            <option key={index} value={chapter}>
              {chapter}
            </option>
          ))}
        </select>
        <div style={{ margin: "0 50px" }}>
          <DataGrid
            header={"Total Amount: $1000"}
            rows={donations}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection
            onRowSelectionModelChange={handleSelectionChange}
            columnHeaderHeight={100}
            sx={{
              border: 13,
              borderColor: "#d9d9d9",
              borderRadius: 2,
              "& .MuiDataGrid-row:nth-child(even)": {
                backgroundColor: "#E0E0E0",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#BDBDBD",
              },
              "& .MuiDataGrid-row:nth-child(odd)": {
                backgroundColor: "#FFFFFF",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Fundraising;
