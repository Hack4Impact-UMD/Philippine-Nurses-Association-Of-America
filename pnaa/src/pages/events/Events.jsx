import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { collection, deleteDoc, doc } from "firebase/firestore";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEventsData } from "../../backend/FirestoreCalls.ts";
import NavigationBar from "../../components/NavigationBar/NavigationBar.jsx";
import SignOutButton from "../../components/SignOutButton/SignOutButton.jsx";
import { db } from "../../config/firebase.ts";
import {
  DataGridStyles,
  QuickSearchToolbar,
  columns,
} from "./EventDetailsUtils.js";
import styles from "./Events.module.css";

const Events = () => {
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  //Fetches all member data within chapter
  useEffect(() => {
    getEventsData()
      .then((event) => {
        setEventsData(event);
      })
      .catch((error) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleExport = () => {
    // Retrieve full event details for each selected row
    const selectedEvents = selectedRows.map((rowId) =>
      events.find((event) => event.id === rowId)
    );
    console.log("ev", selectedEvents);
    const fields = [
      "name",
      "chapter",
      "date",
      "time",
      "location",
      "status",
      "attendee_#",
      "contact_hrs",
      "volunteer_#",
      "participants_served",
      "total_volunteer_hours",
      "region",
      "about",
      "other_details",
    ];
    // Convert selected events to CSV using Papaparse
    const csvData = Papa.unparse({
      fields: fields,
      data: selectedEvents,
    });

    if (selectedEvents.length > 0) {
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

  const handleAddEvent = () => {
    navigate("../event-details", { state: { event: null } });
  };

  const handleDeleteEvent = async () => {
    if (selectedRows.length === 0) {
      alert("No events selected. Please select events to delete.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected events?"
    );

    if (confirmDelete) {
      const eventsRef = collection(db, "events");
      try {
        for (const eventId of selectedRows) {
          const eventRef = doc(eventsRef, eventId);
          await deleteDoc(eventRef);
        }
        const updatedEvents = events.filter(
          (event) => !selectedRows.includes(event.id)
        );
        setEvents(updatedEvents);
        setSelectedRows([]);
        alert("Selected events deleted successfully!");
      } catch (error) {
        console.error("Error deleting events: ", error);
        alert("An error occurred while deleting events. Please try again.");
      }
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1>Events</h1>
        <SignOutButton />
      </div>
      <NavigationBar />
      <div className={styles["content"]}>
        <div className={styles["events-btns"]}>
          <Button
            onClick={handleExport}
            className={styles["events-export-btn"]}>
            Export Registration
          </Button>
          <Button
            onClick={handleDeleteEvent}
            className={`${styles["events-delete-btn"]} ${
              selectedRows.length === 0
                ? styles["events-delete-btn-disabled"]
                : ""
            }`}
            disabled={selectedRows.length === 0}>
            Delete Events
          </Button>
          <Button onClick={handleAddEvent} className={styles["events-add-btn"]}>
            Add Event
          </Button>
        </div>
        <div className={styles.gridContainer}>
          {loading ? (
            "Loading Data"
          ) : error ? (
            "Error fetching data"
          ) : (
            <div className={styles.innerGrid}>
              <DataGrid
                rows={eventsData}
                columns={columns}
                columnHeaderHeight={50}
                rowHeight={40}
                disableRowSelectionOnClick
                slots={{
                  toolbar: QuickSearchToolbar,
                }}
                onRowClick={(row) => {
                  navigate("/event-details", {
                    state: { event: row.row },
                  });
                }}
                sx={DataGridStyles}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
