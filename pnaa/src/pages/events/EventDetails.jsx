import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./EventDetails.module.css";

import {
  getFirestore,
  doc,
  updateDoc,
  setDoc,
  collection,
} from "firebase/firestore";
import { db } from "../../config/firebase.ts";
import EventDialogBox from "./EventDialogBox";

// Material UI Components
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";

const EventDetails = () => {
  // Pass in event data from previous state
  const location = useLocation();
  const { event } = location.state;

  const navigate = useNavigate();

  // Collect screen width for responsive design
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Dialog box state
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState("");

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedEvent, setEditedEvent] = useState(
    event || {
      name: "",
      date: "",
      time: "",
      location: "",
      status: "",
      attendee: "",
      about: "",
      event_poster: "",
      contact_hrs: "",
      other_details: "",
    }
  );
  // Menu anchor for mobile view
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Extract active status from event data for conditional rendering
  const [eventArchived, setEventArchived] = useState(
    event ? event.archived : false
  );

  // Screen width breakpoints
  const mediumScreenWidth = 1200;
  const halfScreenWidth = 800;
  const mobileScreenWidth = 660;

  // Update screen width on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (event) {
      setEditedEvent(event);
      setEventArchived(event.archived);
    } else {
      setIsEditMode(true);
      setEventArchived(false);
    }
  }, [event]);

  // Handle action button clicks
  const handleBackClick = () => {
    navigate(-1);
  };

  const handleArchiveClick = () => {
    if (eventArchived) {
      setDialogAction("unarchive");
    } else {
      setDialogAction("archive");
    }
    setDialogOpen(true);
  };

  const handleEditClick = () => {
    if (isEditMode) {
      handleSaveClick();
    }
    setIsEditMode(!isEditMode);
  };

  const handleSaveClick = async () => {
    if (event === null) {
      // Create a new event
      try {
        const eventsCol = collection(db, "events");
        const newEventRef = doc(eventsCol);
        await setDoc(newEventRef, editedEvent);
        setIsEditMode(false);
        navigate("/chapter-dashboard/events");
      } catch (error) {
        console.error("Error creating event: ", error);
      }
    } else {
      // Update existing event
      const eventRef = doc(db, "events", editedEvent.id);
      try {
        await updateDoc(eventRef, editedEvent);
        setIsEditMode(false);
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  // Handle menu click for mobile view
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Modify button text for half screen width
  const buttonText = (text, isArchiveButton = false) => {
    if (isArchiveButton) {
      if (eventArchived) {
        text = "Unarchive event";
      } else {
        text = "Archive event";
      }
    }

    if (screenWidth < mediumScreenWidth) {
      return text.split(" ")[0];
    }
    return text;
  };

  // Function for creating different Material UI action buttons
  const createMaterialButton = (
    color,
    text,
    onClick,
    disabled = false,
    isArchiveButton = false
  ) => (
    <Button
      startIcon={<AddIcon />}
      style={{
        backgroundColor: disabled ? "#ccc" : color,
        color: disabled ? "#666" : "#fff",
        fontFamily: "'Source Serif 4', serif",
        fontSize: "14px",
        borderRadius: "6px",
        padding: "6px 12px",
        textTransform: "none",
        pointerEvents: disabled ? "none" : "auto",
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {buttonText(text, isArchiveButton)}
    </Button>
  );

  // Use active status to determine which buttons are available
  const actionButtons = () => (
    <div className={styles["action-button-group"]}>
      {createMaterialButton(
        "#4D69BE",
        "Back to main page",
        handleBackClick,
        isEditMode
      )}
      {createMaterialButton(
        "#05208B",
        isEditMode ? "Save event" : "Edit event",
        handleEditClick,
        false
      )}
      {createMaterialButton(
        eventArchived ? "#14804A" : "#91201A",
        "",
        handleArchiveClick,
        isEditMode,
        true
      )}
    </div>
  );

  // Create Material UI menu items for mobile view, same functionality as action buttons
  // Use conditional rendering based on active statuss
  const actionMenuItems = () => (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
    >
      {!isEditMode && (
        <MenuItem
          onClick={() => {
            handleClose();
            handleBackClick();
          }}
          style={{ color: "#4D69BE", fontFamily: "'Source Serif 4', serif" }}
        >
          Back to main page
        </MenuItem>
      )}
      <MenuItem
        onClick={() => {
          handleClose();
          handleEditClick();
        }}
        style={{ color: "#05208B", fontFamily: "'Source Serif 4', serif" }}
      >
        {isEditMode ? "Save event" : "Edit event"}
      </MenuItem>
      {!isEditMode && (
        <MenuItem
          onClick={() => {
            handleClose();
            handleArchiveClick();
          }}
          style={{
            color: eventArchived ? "#14804A" : "#91201A",
            fontFamily: "'Source Serif 4', serif",
          }}
        >
          {eventArchived ? "Unarchive event" : "Archive event"}
        </MenuItem>
      )}
    </Menu>
  );

  const fieldsToShow = [
    "date",
    "time",
    "location",
    "status",
    "attendee#",
    "about",
    "event poster",
    "contact hrs",
  ];

  // Else, display normal screen
  return (
    <div className={styles["event-detail-container"]}>
      <div className={styles["event-detail-content"]}>
        <div className={styles["event-header-container"]}>
          {isEditMode ? (
            <input
              type="text"
              value={editedEvent.name}
              onChange={(e) =>
                setEditedEvent({
                  ...editedEvent,
                  ["name"]: e.target.value,
                })
              }
              className={styles["event-header-input"]}
            />
          ) : (
            <p className={styles["event-header"]}>{editedEvent.name}</p>
          )}
          {screenWidth < mobileScreenWidth ? (
            <>
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MenuIcon />
              </IconButton>
              {actionMenuItems()}
            </>
          ) : (
            actionButtons()
          )}
        </div>

        <div className={styles["event-detail-information-container"]}>
          <table className={styles["event-detail-table"]}>
            {fieldsToShow.map((fieldName) => {
              const value = editedEvent[fieldName] || ""; // Initialize value to an empty string if key doesn't exist
              return (
                <tr key={fieldName}>
                  <td>
                    <p className={styles["event-label"]}>
                      {fieldName.toUpperCase()}
                    </p>
                  </td>
                  <td>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          setEditedEvent({
                            ...editedEvent,
                            [fieldName]: e.target.value,
                          })
                        }
                        className={styles["edit-input"]} // Add CSS for this
                      />
                    ) : (
                      <p className={styles["event-data"]}>{value.toString()}</p>
                    )}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td>
                <p className={styles["event-label"]}>OTHER DETAILS</p>
              </td>
              <td className={styles["other-details"]}>
                <p>{editedEvent.other_details}</p>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <EventDialogBox
        open={isDialogOpen}
        handleClose={() => setDialogOpen(false)}
        eventName={editedEvent.name || ""}
        eventId={editedEvent.id || ""}
        dialogAction={dialogAction}
        onActionSuccess={() => setEventArchived(!eventArchived)}
      />{" "}
    </div>
  );
};

export default EventDetails;
