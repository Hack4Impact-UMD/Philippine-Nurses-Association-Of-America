import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavigationBar from "../../../components/NavigationBar/NavigationBar";
import SignOutButton from "../../../components/SignOutButton/SignOutButton";
import styles from "./SingleChapterDetails.module.css";
import {
  DataGridStyles,
  QuickSearchToolbar,
  columns,
} from "./SingleChapterUtils";

const SingleChapterDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [chapterDetails, setChapterDetails] = useState();
  useEffect(() => {
    // Get data from navigation state, otherwise navigate to home page
    if (location.state?.fromApp && location.state.chapterDetails) {
      setChapterDetails(location.state.chapterDetails);
    } else {
      navigate("/details");
    }
  }, []);
  return (
    <div>
      <div className={styles.header}>
        <h1>Chapter Details</h1>
        <SignOutButton />
      </div>
      <NavigationBar />
      <div className={styles.gridContainer}>
        <Paper className={styles.paper}>
          <div className={styles.secondHeader}>
            <h1>{chapterDetails?.name.toUpperCase()}</h1>
            <p>{chapterDetails?.region}</p>
          </div>
          <div className={styles.body}>
            <div className={styles.statistics}>
              <div className={styles.statistic}>
                <p className={styles.statHeader}>Total Members</p>
                <p className={styles.value}>
                  {(parseInt(chapterDetails?.totalActive) || 0) +
                    (parseInt(chapterDetails?.totalLapsed) || 0)}
                </p>
              </div>
              <div className={styles.statistic}>
                <p className={styles.statHeader}>Active Members</p>
                <p className={styles.value}>
                  {parseInt(chapterDetails?.totalActive) || 0}
                </p>
              </div>
              <div className={styles.statistic}>
                <p className={styles.statHeader}>Lapsed Members</p>
                <p className={styles.value}>
                  {parseInt(chapterDetails?.totalLapsed) || 0}
                </p>
              </div>
              <div className={styles.statistic}>
                <p className={styles.statHeader}>Events Held</p>
                <p className={styles.value}>
                  {parseInt(chapterDetails?.totalEvents) || 0}
                </p>
              </div>
              <div className={styles.statistic}>
                <p className={styles.statHeader}>Total Volunteers</p>
                <p className={styles.value}>
                  {parseInt(chapterDetails?.totalVolunteerNum) || 0}
                </p>
              </div>
              <div className={styles.statistic}>
                <p className={styles.statHeader}>Total Volunteer Hours</p>
                <p className={styles.value}>
                  {parseInt(chapterDetails?.totalVolunteerHours) || 0}
                </p>
              </div>
              <div className={styles.statistic}>
                <p className={styles.statHeader}>Participants Served</p>
                <p className={styles.value}>
                  {parseInt(chapterDetails?.totalParticipantsServed) || 0}
                </p>
              </div>
            </div>
            <div className={styles.members}>
              {chapterDetails?.members ? (
                <DataGrid
                  rows={chapterDetails?.members}
                  columns={columns}
                  columnHeaderHeight={45}
                  rowHeight={35}
                  disableRowSelectionOnClick
                  slots={{
                    toolbar: QuickSearchToolbar,
                  }}
                  sx={DataGridStyles}
                  getRowId={(row) => row.memberId}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default SingleChapterDetails;
