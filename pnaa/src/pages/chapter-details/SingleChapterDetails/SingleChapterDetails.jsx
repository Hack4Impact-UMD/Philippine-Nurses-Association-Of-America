import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import styles from "./SingleChapterDetails.module.css";
import {
  DataGridStyles,
  QuickSearchToolbar,
  columns,
} from "./SingleChapterUtils";

const SingleChapterDetails = (chapterDetails) => {
  console.log(chapterDetails);
  return (
    <Paper className={styles.paper}>
      <div className={styles.header}>
        <h1>{chapterDetails.row.name.toUpperCase()}</h1>
        <p>{chapterDetails.row.region}</p>
      </div>
      <div className={styles.body}>
        <div className={styles.statistics}>
          <div className={styles.statistic}>
            <p className={styles.statHeader}>Total Members</p>
            <p className={styles.value}>
              {(parseInt(chapterDetails.row.totalActive) || 0) +
                (parseInt(chapterDetails.row.totalLapsed) || 0)}
            </p>
          </div>
          <div className={styles.statistic}>
            <p className={styles.statHeader}>Active Members</p>
            <p className={styles.value}>
              {parseInt(chapterDetails.row.totalActive) || 0}
            </p>
          </div>
          <div className={styles.statistic}>
            <p className={styles.statHeader}>Lapsed Members</p>
            <p className={styles.value}>
              {parseInt(chapterDetails.row.totalLapsed) || 0}
            </p>
          </div>
          <div className={styles.statistic}>
            <p className={styles.statHeader}>Events Held</p>
            <p className={styles.value}>
              {parseInt(chapterDetails.row.totalEvents) || 0}
            </p>
          </div>
          <div className={styles.statistic}>
            <p className={styles.statHeader}>Total Volunteers</p>
            <p className={styles.value}>
              {parseInt(chapterDetails.row.totalVolunteerNum) || 0}
            </p>
          </div>
          <div className={styles.statistic}>
            <p className={styles.statHeader}>Total Volunteer Hours</p>
            <p className={styles.value}>
              {parseInt(chapterDetails.row.totalVolunteerHours) || 0}
            </p>
          </div>
          <div className={styles.statistic}>
            <p className={styles.statHeader}>Participants Served</p>
            <p className={styles.value}>
              {parseInt(chapterDetails.row.totalParticipantsServed) || 0}
            </p>
          </div>
        </div>
        <div className={styles.members}>
          <DataGrid
            rows={chapterDetails.row.members}
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
        </div>
      </div>
    </Paper>
  );
};

export default SingleChapterDetails;
