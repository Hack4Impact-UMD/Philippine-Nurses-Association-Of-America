import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChapterData } from "../../backend/FirestoreCalls";
import { Button } from "@mui/material";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import SignOutButton from "../../components/SignOutButton/SignOutButton";
import styles from "./Dashboard.module.css";
import DateSelection from "./DateSelection/DateSelection";
import dayjs from "dayjs";

const Dashboard = () => {
  const [chapterData, setChapterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [national, setNational] = useState(true);
  const [selectedRow, setSelectedRow] = useState();
  const [openDateSelection, setOpenDateSelection] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
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
            <div className={styles.mainPanel}>
              <div className={styles.dateSelection}>
                <div className={styles.dateRange}>
                  {dayjs(startDate).format("MM/DD/YYYY")} -{" "}
                  {dayjs(endDate).format("MM/DD/YYYY")}
                </div>
                <Button
                  variant="outlined"
                  className={styles.dateButton}
                  onClick={() => setOpenDateSelection(true)}>
                  Select Date Range
                </Button>
              </div>

              <div className={styles.displayInfo}>
                <div>PARTICIPANTS SERVED</div>
                <div>####</div>
                <div>CONTACT HOURS</div>
                <div>####</div>
                <div>ACTIVE MEMBERS</div>
                <div>####</div>
                <div>SERVICE HOURS</div>
                <div>####</div>
              </div>
              <div className={styles.selectionContainers}>
                <div className={styles.locationContainer}> </div>
                <div className={styles.locationContainer}> </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <DateSelection
        open={openDateSelection}
        handleClose={() => {
          setOpenDateSelection(!openDateSelection);
        }}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
    </div>
  );
};

export default Dashboard;
