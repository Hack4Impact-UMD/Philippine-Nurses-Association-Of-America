import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getChapterData,
  getEventsData,
  getFundraisingData,
} from "../../../backend/FirestoreCalls";
import NavigationBar from "../../../components/NavigationBar/NavigationBar";
import SignOutButton from "../../../components/SignOutButton/SignOutButton";
import styles from "./ChapterDetails.module.css";
import {
  DataGridStyles,
  QuickSearchToolbar,
  columns,
} from "./ChapterDetailsUtils";

const ChapterDetails = () => {
  const [chapterData, setChapterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  //Fetches all member data within chapter
  useEffect(() => {
    const promises = [getChapterData(), getEventsData(), getFundraisingData()];
    Promise.all(promises)
      .then((data) => {
        data[0].push({
          id: "National",
          members: [],
          name: "National",
          region: "National",
          totalActive: 0,
          totalLapsed: 0,
        });
        const chapterId = {};
        data[0].map((chapter, ind) => {
          chapterId[chapter.name] = ind;
        });
        data[1].map((e) => {
          data[0][chapterId[e.event.chapter]].events =
            1 + (data[0][chapterId[e.event.chapter]].events || 0);
        });

        data[2].map((e) => {
          data[0][chapterId[e.fundraising.chapterName]].fundraisers =
            1 +
            (data[0][chapterId[e.fundraising.chapterName]].fundraisers || 0);
        });

        setChapterData(data[0]);
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

export default ChapterDetails;
