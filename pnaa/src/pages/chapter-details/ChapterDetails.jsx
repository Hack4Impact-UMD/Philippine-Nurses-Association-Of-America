
import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { useUser } from "../../config/UserContext";
import { getFirestore, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase.ts";
import { Link, useNavigate } from "react-router-dom";

import { DataGrid } from '@mui/x-data-grid';
import { Select, MenuItem, Button } from '@mui/material';
import styles from "./ChapterDetails.module.css";
import { Email } from "@mui/icons-material";


const ChapterDetails = () => {
  const { currentUser, loading: userLoading } = useUser();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const location = useLocation();
  const { chapter } = location.state;
  const navigate = useNavigate();

    //Fetches all member data within chapter
    useEffect(() => {
      const fetchMembers = async () => {
        const db = getFirestore();
        const membersRef = collection(
          db,
          "chapters",
          chapter.id,
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
    const Status = ({ text, width, height }) => {
      const getColorStyles = (status) => {
        switch (status) {
          case 'Active':
            return { backgroundColor: '#E1FCEF', color: 'green' };
          case 'Lapsed':
            return { backgroundColor: '#FCE4E4', color: 'red' };
          default:
            return { backgroundColor: '#EBF0FA', color: 'black' };
        }
      };
    
      const styles = {
        status: {
          ...getColorStyles(text),
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
    };


    const columns = [
      {
        field: 'name',
        headerName: <div style={{paddingLeft: '20px'}}>NAME</div>,
        width: 220,
        renderCell: (params) => (
          <div
            style={{ cursor: 'pointer', paddingLeft: '20px' }}
            onClick={() => navigateToMemberDetails(params.row)}
          >
            {params.row.name}
          </div>
        ),
      },
      { field: 'status', headerName: 'STATUS', width: 150, 
        renderCell: (params) => ( 
          <Status text={params.row.activeStatus} backgroundColor={"#E1FCEF"} textColor="green" width="58px" height="20px"/> 
        ) 
      },
      { field: 'renewal-due', headerName: 'RENEWAL DUE', width: 150, 
      renderCell: (params) => ( 
        <div>{params.row.renewalDueDate}</div>
      ) 
      },
      { field: 'email', headerName: 'EMAIL', width: 250, 
      renderCell: (params) => ( 
        <div>{params.row.email}</div>
      ) 
      },
    ];
  
    const handleSelectionChange = (newSelection) => {
      setSelectedRows(newSelection);
    };
  
    const navigateToMemberDetails = (member) => {
      navigate(`/chapter-dashboard/member-detail/`, { state: { member } });
    };

    const fieldsToShow = [
      "Total Members",
      "Total Events",
      "Total Volunteers Hours",
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
                      <strong>{fieldName}</strong>
                    </td>
                    <td>
                      <p className={styles["chapter-data"]}>#{value.toString()}</p>
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
              onRowSelectionModelChange={handleSelectionChange}
              columnHeaderHeight={100}
              sx={{
                border: 10,
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



