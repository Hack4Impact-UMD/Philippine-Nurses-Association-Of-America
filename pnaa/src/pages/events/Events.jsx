import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEventsData } from "../../backend/FirestoreCalls";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import SignOutButton from "../../components/SignOutButton/SignOutButton";
import EventPopup from "./AddEvent/EventPopup/EventPopup";
import {
  DataGridStyles,
  QuickSearchToolbar,
  columns,
  convertMilitaryTime,
} from "./EventDetailsUtils";
import styles from "./Events.module.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [showArchived, setShowArchived] = useState(true);
  const [selectedRow, setSelectedRow] = useState([]);
  const navigate = useNavigate();

  //Fetches all member data within chapter
  useEffect(() => {
    getEventsData()
      .then(async (result) => {
        setEvents(result);
      })
      .catch((error) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const gridAPI = useGridApiRef();

  const handleExport = () => {
    const ids = selectedRow.map((row) => row.id);
    const uniqueIds = new Set(ids);
    const filteredRows = events
      .filter((row) => uniqueIds.has(row.id))
      .map((row) => row.event);

    const fields = [
      "name",
      "chapter",
      "region",
      "location",
      "startDate",
      "endDate",
      "startTime",
      "endTime",
      "about",
      "otherDetails",
      "attendees",
      "volunteers",
      "participantsServed",
      "contactHours",
      "volunteerHours",
      "archived",
      "lastUpdated",
      "lastUpdatedUser",
      "creationDate",
      "eventPoster",
    ];
    const processedData = filteredRows.map((item) => {
      const newObj = structuredClone(item);
      newObj["eventPoster"] = item["eventPoster"]?.downloadURL;
      newObj["lastUpdated"] =
        new Date(item.lastUpdated.seconds * 1000)
          .toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
          .toString() + " EST";

      newObj["creationDate"] =
        new Date(item.creationDate.seconds * 1000)
          .toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
          .toString() + " EST";
      newObj["startTime"] = convertMilitaryTime(item.startTime);

      newObj["endTime"] = convertMilitaryTime(item.endTime);
      return newObj;
    });

    // Convert selected events to CSV using Papaparse
    const csvData = Papa.unparse({ fields, data: processedData });

    if (filteredRows.length > 0) {
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

      // Create a link and trigger the download
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "chapter_events.csv");
      document.body.appendChild(link); // Required for FF
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Nothing Selected");
    }
  };
  return (
    <div>
      <EventPopup
        open={openPopup}
        mode="Delete"
        handleClose={() => {
          setOpenPopup(false);
        }}
        deleteList={selectedRow}
      />
      <div className={styles.header}>
        <h1>Event Details</h1>
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
            <div className={styles.topRow}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) => {
                      setShowArchived(e.target.checked);
                    }}
                    checked={showArchived}
                  />
                }
                label="Show Archived Events"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.875rem",
                  },
                }}
              />
              <div>
                <Button
                  className={styles.exportButton}
                  disabled={selectedRow?.length == 0}
                  onClick={() => handleExport()}
                  sx={{
                    "&.Mui-disabled": {
                      backgroundColor: "gray !important",
                    },
                  }}
                >
                  Export Events
                </Button>
                <Button
                  className={styles.deleteButton}
                  disabled={selectedRow?.length == 0}
                  onClick={() => setOpenPopup(true)}
                  sx={{
                    "&.Mui-disabled": {
                      backgroundColor: "gray !important",
                    },
                  }}
                >
                  Delete Events
                </Button>
                <Button
                  className={styles.addButton}
                  onClick={() => navigate("../add-event")}
                >
                  Add Event
                </Button>
              </div>
            </div>
            <DataGrid
              checkboxSelection
              apiRef={gridAPI}
              rows={
                showArchived
                  ? events
                  : events.filter((row) => !row.event.archived)
              }
              columns={columns}
              columnHeaderHeight={50}
              rowHeight={40}
              disableRowSelectionOnClick
              slots={{
                toolbar: QuickSearchToolbar,
              }}
              slotProps={{
                toolbar: gridAPI,
              }}
              onRowClick={(row) => {
                navigate("../add-event", { state: row.row });
              }}
              sx={DataGridStyles}
              onRowSelectionModelChange={(ids) => {
                const idSet = new Set(ids);
                const tempArr = [];
                for (let i = 0; i < events.length; i++) {
                  if (idSet.has(events[i].id)) {
                    tempArr.push({
                      ref: events[i].event.eventPoster?.ref,
                      id: events[i].id,
                    });
                  }
                }
                setSelectedRow(tempArr);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
