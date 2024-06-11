import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChapterData } from "../../../backend/FirestoreCalls";
import NavigationBar from "../../../components/NavigationBar/NavigationBar";
import SignOutButton from "../../../components/SignOutButton/SignOutButton";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [chapterData, setChapterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [national, setNational] = useState(true);
  const [selectedRow, setSelectedRow] = useState();
  const navigate = useNavigate();

  //Fetches all member data within chapter
  useEffect(() => {
    getChapterData()
      .then((chapter) => {
        setChapterData(chapter);
      })
      .catch((error) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className={styles.header}>
        <h1>Chapter Details</h1>
        <SignOutButton />
      </div>
      <NavigationBar />
      <div className={styles.gridContainer}>
        {loading ? (
          "Loading Data"
        ) : error ? (
          "Error fetching data"
        ) : (
          <div className={styles.innerGrid}>
            <DataGrid
              rows={chapterData}
              columns={columns}
              columnHeaderHeight={50}
              rowHeight={40}
              disableRowSelectionOnClick
              slots={{
                toolbar: QuickSearchToolbar,
              }}
              onRowClick={(row) => {
                console.log(row.row);
                navigate("/details/chapter", {
                  state: {
                    fromApp: true,
                    chapterDetails: row.row,
                  },
                });
              }}
              sx={DataGridStyles}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
