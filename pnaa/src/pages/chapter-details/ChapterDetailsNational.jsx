
import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { useUser } from "../../config/UserContext";
import { getFirestore, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase.ts";
import { Link, useNavigate } from "react-router-dom";

import { DataGrid } from '@mui/x-data-grid';
import { Select, MenuItem, Button } from '@mui/material';
import styles from "./ChapterDetailsNational.module.css";


const ChapterDetailsNational = () => {
  const [chapters, setChapters] = useState([]); // State to hold the list of chapters
  const { currentUser, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();

    //Fetches all member data within chapter
    useEffect(() => {
        const fetchChapters = async () => {
          const db = getFirestore();
          const chaptersRef = collection(db, 'chapters');
          try {
            const snapshot = await getDocs(chaptersRef);
            const chaptersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            console.log("chaopterslist", chaptersList);
            setChapters(chaptersList);
          } catch (error) {
            console.error("Error fetching chapters: ", error);
          }
        }
        fetchChapters();
      }, [currentUser]);
  
    if (userLoading || loading) {
      return <div>Loading...</div>;
    }
  
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

      const columns = [
        //{ field: 'name', headerName: 'NAME', width: 250, cellClassName:'event-cell' },
        {
          field: 'name',
          headerName: 'NAME',
          width: 275,
          renderCell: (params) => (
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => navigateToChapterDetails(params.row)}
            >
              {params.row.name}
            </div>
          ),
        },
        { field: 'president', headerName: 'PRESIDENT', width: 250, cellClassName:'cell' },
        { field: 'member-count', headerName: 'MEMBER COUNT', width: 300, cellClassName:'cell'},
        { field: 'contact hrs', headerName: 'CONTACT HRS', width: 300, cellClassName:'cell'},
        { field: 'volunteer#', headerName: 'VOLUNTEER #', width: 341, cellClassName:'cell'},
        { field: 'participants_served', headerName: 'PARTICIPANTS SERVED', width: 300, cellClassName:'cell'},
      ];

      const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection);
      };

      const navigateToChapterDetails = (chapter) => {
        console.log("chapter", chapter);
        navigate(`/chapter-dashboard/chapter-details/`, { state: { chapter } });
      };

      const ChapterButton = ({ text, backgroundColor, width, height }) => {
        const styles = {
          ChapterButton: {
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
          <div style={styles.ChapterButton}>
            {text}
          </div>
        );
      }

      const ArchiveChapter = (
        <div style={{ marginRight: '10px'}}>
          <ChapterButton
            text="Archive Chapter"
            backgroundColor={"#05208B"}
            width="150px"
            height="32px"
          />
        </div>
      );
  
    
  return (
    <div className={styles["chapter-details-container"]}>
      <div>
        <h1>Chapters</h1>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', marginBottom: '10px' }}>
            {ArchiveChapter}
        </div>
        <div className={styles["chapter-details-inner"]}>
          <div className={styles["chapter-details-data"]}>
          
          <DataGrid
            rows={chapters}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelections
            onRowSelectionModelChange={handleSelectionChange}
            //Keep this out, we would rather click on name than entire row
            // onRowClick={handleRowClick} // Add the onRowClick event handler 
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
    </div>
  );
};


export default ChapterDetailsNational;