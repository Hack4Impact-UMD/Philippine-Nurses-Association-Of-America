
import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { useUser } from "../../config/UserContext";
import { getFirestore, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase.ts";
import { Link, useNavigate } from "react-router-dom";

import { DataGrid } from '@mui/x-data-grid';
import { Select, MenuItem, Button } from '@mui/material';
import styles from "./ChapterDetails.module.css";


const ChapterDetails = () => {
  const { currentUser, loading: userLoading } = useUser();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const location = useLocation();
  const { chapter } = location.state;
  console.log("ffdffdf" + chapter);
  const navigate = useNavigate();

    //Fetches all member data within chapter
    useEffect(() => {
      const fetchMembers = async () => {
        const db = getFirestore();
        const membersRef = collection(
          db,
          "chapters",
          chapter.chapterId,
          "members"
        );

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

    const columns = [
      { field: '#', headerName: '#', width: 50 },
      {
        field: 'name',
        headerName: 'NAME',
        width: 175,
        renderCell: (params) => (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => navigateToMemberDetails(params.row)}
          >
            {params.row.FirstName + " " + params.row.LastName}
          </div>
        ),
      },
      { field: 'membership-level', headerName: 'MEMBERSHIP LEVEL', width: 250, renderCell: (params) => ( <Status text="Active Member (1 year)" backgroundColor={"#EBF0FA"} textColor="blue" width="163px" height="20px"/> ) },
      { field: 'status', headerName: 'STATUS', width: 150, renderCell: (params) => ( <Status text="Active" backgroundColor={"#E1FCEF"} textColor="green" width="58px" height="20px"/> ) },
    ];
  
    const handleSelectionChange = (newSelection) => {
      setSelectedRows(newSelection);
    };
  
    const navigateToMemberDetails = (member) => {
      navigate(`/chapter-dashboard/member-detail/`, { state: { member } });
    };

    const fieldsToShow = [
      "Active Member 1 Year",
      "Active Member 2 Years",
      "Active Member Lifetime",
      "Associate Member 1 Year",
      "Associate Member 2 Years",
      "Member At Large",
      "Student",
      "Lapsed Member",
    ];
  
  return (
    <div className={styles["chapter-details-container"]}>
      <div>
        <h1>{chapter.name}</h1>
        <p>{chapter.region}</p>
        <div className={styles["chapter-details-inner"]}>
          <div className={styles["chapter-details-left"]}>

            <table className={styles["chapter-detail-table"]}>
              {fieldsToShow.map((fieldName) => {
                const value = chapter[fieldName] || ""; // Initialize value to an empty string if key doesn't exist
                return (
                  <tr key={fieldName}>
                    <td>
                      <p>
                        {fieldName.split(" ").map((word, index) => {
                          const isSpecialWord = ["1", "2", "Lifetime", "Year", "Years"].some(phrase => word.includes(phrase));
                          return (
                            <React.Fragment key={index}>
                              <span className={isSpecialWord ? styles["special-word"] : ""}>
                                {word}
                              </span>{" "}
                            </React.Fragment>
                          );
                        })}
                      </p>
                    </td>
                    <td>
                      <p className={styles["chapter-data"]}>###{value.toString()}</p>
                    </td>
                  </tr>
                );
              })}
            </table>
          </div>
          <div className={styles["chapter-details-right"]}>
            <DataGrid
              rows={members}
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
    

    </div>
  );
};


export default ChapterDetails;



