
import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { useUser } from "../../config/UserContext";
import { getFirestore, collection, doc, getDoc, getDocs } from "firebase/firestore";
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
  const [searchTerm, setSearchTerm] = useState("");
  const filteredChapters = chapters.filter(chapter => chapter.name.toLowerCase().includes(searchTerm.toLowerCase()));


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

    //Fetches all member data within chapter
    useEffect(() => {
        const fetchChapters = async () => {
          const db = getFirestore();
          const chaptersRef = collection(db, 'chapters');
          try {
            const snapshot = await getDocs(chaptersRef);
            const chaptersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
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
        {
          field: 'name',
          headerName: <div style={{paddingLeft: '20px'}}>NAME</div>,
          width: 300,
          renderCell: (params) => (
            <div
              style={{ cursor: 'pointer', paddingLeft: '20px' }}
              onClick={() => navigateToChapterDetails(params.row)}
            >
              {params.row.name}
            </div>
          ),
        },
        { field: 'member-count', headerName: 'MEMBER COUNT', width: 150, 
          renderCell: (params) => (
            <div>{params.row.totalActive + params.row.totalLapsed}</div>
          ),
        },
        { field: 'active-count', headerName: 'ACTIVE #', width: 150, 
          renderCell: (params) => (
            <div>{params.row.totalActive}</div>
          ),
        },
        { field: 'lapsed-count', headerName: 'LAPSED #', width: 150, 
          renderCell: (params) => (
            <div>{params.row.totalLapsed}</div>
          ),
        },
        { field: 'event-count', headerName: 'EVENTS #', width: 150, 
          renderCell: (params) => (
            <div></div>
          ),
        },
        { field: 'volunteer-hours', headerName: 'VOLUNTEER HOURS', width: 1000, 
        renderCell: (params) => (
          <div></div>
        ),
      },
      ];

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
      <div>
        <h1>Chapter Details</h1>
        <input
          type="text"
          placeholder="Search by chapter name"
          value={searchTerm}
          onChange={handleSearch}
          style={{ marginBottom: '10px' }}
        />
        {/* <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', marginBottom: '10px' }}>
            {ArchiveChapter}
        </div> */}
        <DataGrid
            rows={filteredChapters}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelections
            columnHeaderHeight={100}
            slotProps={{
              header: () => (
                <div style={{ marginBottom: '10px' }}>
                  Filter by chapter name:
                  <input
                    type="text"
                    placeholder="Search by chapter name"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              ),
            }}
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
  );
};


export default ChapterDetailsNational;