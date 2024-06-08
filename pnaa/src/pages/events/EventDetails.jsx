import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase.ts";
import styles from "./EventDetails.module.css";
import EventDialogBox from "./EventDialogBox";

// Material UI Components
import {
  Archive,
  KeyboardArrowLeft,
  ModeEdit,
  Unarchive,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const EventDetails = () => {
  /*****************************************************************************
   * Variables and States
   *****************************************************************************/
 
  const navigate = useNavigate();

  // Pass in event data from previous state
  const location = useLocation();
  const { event } = location.state;
  const [chapters, setChapters] = useState([]);

  // Collect screen width for responsive design
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Dialog box state
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState("");

  // edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEventTimeChanged, setIsEventTimeChanged] = useState(false);
  const [editedEvent, setEditedEvent] = useState(
    event || {
      name: "",
      id: "",
      archived: false,
      date: "",
      time: "",
      location: "",
      status: "Chapter", //Default status
      chapter: "National", //Automatically fills in chapter of the user
      region: "Not Specified",
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

  // Error handling for event name validation
  const [nameError, setNameError] = useState("");

  // Screen width breakpoints
  const mediumScreenWidth = 1200;
  const halfScreenWidth = 800;
  const mobileScreenWidth = 660;

  /*****************************************************************************
   * UseEffect
   *****************************************************************************/
  // Update screen width on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fetch event data from Firestore and save
  useEffect(() => {
    const fetchEventData = async () => {
      if (event && event.id) {
        const eventRef = doc(db, "events", event.id.toString());
        const eventSnap = await getDoc(eventRef);
        if (eventSnap.exists()) {
          setEditedEvent(eventSnap.data());
          setEventArchived(eventSnap.data().archived);
        }
      } else {
        setIsEditMode(true);
        setEditedEvent((prev) => ({
          ...prev,
          chapter: "National",
        }));
        setEventArchived(false);
      }
    };

    fetchEventData();
  }, [event]);

  /*****************************************************************************
   * Action Buttons (Back, Edit/Save, Archive/Unarchive)
   *****************************************************************************/
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
    } else {
      setIsEditMode(true);
    }
  };

  const handleSaveClick = async () => {
    if (!editedEvent.name || editedEvent.name.trim() === "") {
      setNameError("Please enter a valid event name.");
      return;
    }
    setNameError("");
    if (isEventTimeChanged) {
      // Calculate contact hours based on start and end time
      const [startTime, endTime] = editedEvent.time.split(" - ");
      const startDate = new Date(`2000-01-01T${startTime}`);
      const endDate = new Date(`2000-01-01T${endTime}`);
      const contactHours = (endDate - startDate) / 3600000; // Convert milliseconds to hours
      let roundedContactHours = Math.round(contactHours * 100) / 100; // Round to two decimal places
      if (roundedContactHours < 0) {
        roundedContactHours = 24 + roundedContactHours;
      }
      editedEvent.contact_hrs = roundedContactHours.toString();
      setIsEventTimeChanged(false);
    }
    if (editedEvent["volunteer_#"] && editedEvent.contact_hrs) {
      //   const fullTimeNum =
      //     (editedEvent.contact_hrs * editedEvent["volunteer_#"]) / 8;
      //   const roundedFullTimeNum = Math.round(fullTimeNum * 1000) / 1000;
      //   editedEvent["full_time_#"] = roundedFullTimeNum.toString();
      const totalVolunteerHours =
        editedEvent.contact_hrs * editedEvent["volunteer_#"];
      const roundedTotalVolunteerHours =
        Math.round(totalVolunteerHours * 100) / 100;
      editedEvent.total_volunteer_hours = roundedTotalVolunteerHours.toString();
    }
    if (event === null) {
      // Create a new event
      try {
        const eventsCol = collection(db, "events");
        const newEventRef = doc(eventsCol);
        const newEventId = newEventRef.id;
        // set newly created doc id as a field
        editedEvent.id = newEventId;
        await setDoc(newEventRef, editedEvent);
        setIsEditMode(false);
        // navigate("/chapter-dashboard/events");
      } catch (error) {
        console.error("Error creating event: ", error);
      }
    } else {
      // Update existing event
      try {
        const eventRef = doc(db, "events", event.id.toString()); // Use event.id instead of editedEvent.id
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
    icon,
    color,
    text,
    onClick,
    disabled = false,
    isArchiveButton = false
  ) => (
    <Button
      startIcon={icon}
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
        <KeyboardArrowLeft />,
        "#4D69BE",
        "Back to main page",
        handleBackClick,
        isEditMode
      )}
      {createMaterialButton(
        <ModeEdit />,
        "#05208B",
        isEditMode ? "Save event" : "Edit event",
        handleEditClick,
        false
      )}
      {createMaterialButton(
        eventArchived ? <Unarchive /> : <Archive />,
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

  /*****************************************************************************
   * Display Fields
   *****************************************************************************/
  const fieldsToShow = [
    "date",
    "time",
    "location",
    "status",
    "chapter",
    "region",
    "about",
    "event_poster",
    "attendee_#",
    "volunteer_#",
    "participants_served",
    "contact_hrs",
    // "full_time_#",
    "total_volunteer_hours",
    "other_details",
  ];

  const fieldTypes = {
    date: { type: "date" },
    time: {
      type: "time",
    },
    location: { type: "text" },
    status: { type: "text" },
    chapter: { type: "text" },
    "attendee_#": { type: "number" },
    "volunteer_#": { type: "number" },
    participants_served: {
      type: "number",
    },
    // "full_time_#": { type: "number" },
    total_volunteer_hours: { type: "number" },
    about: { type: "text" },
    event_poster: { type: "text" },
    contact_hrs: { type: "number" },
    other_details: { type: "text" },
  };

  const statusOptions = ["National", "Chapter", "Non-Chapter"];

  /*****************************************************************************
   * Page Layout
   *****************************************************************************/
  return (
    <div className={styles["event-detail-container"]}>
      <div className={styles["event-detail-content"]}>
        <div className={styles["event-header-container"]}>
          <div className={styles["event-header-name"]}>
            {isEditMode ? (
              <>
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
                {nameError && (
                  <p className={styles["event-header-error-message"]}>
                    {nameError}
                  </p>
                )}
              </>
            ) : (
              <p className={styles["event-header"]}>{editedEvent.name}</p>
            )}
          </div>
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
              const value = editedEvent[fieldName] || "";
              const { type, validate } = fieldTypes[fieldName] || {};
              const readOnly =
                (fieldName === "chapter" ||
                  fieldName === "full_time_#" ||
                  fieldName === "region") &&
                event;
              return (
                <tr key={fieldName}>
                  <td>
                    <p className={styles["event-label"]}>
                      {fieldName.toUpperCase().split("_").join(" ")}
                    </p>
                  </td>
                  <td>
                    {isEditMode && fieldName === "time" ? (
                      <>
                        <input
                          type="time"
                          value={value.split(" - ")[0]}
                          onChange={(e) => {
                            const [_, endTime] = value.split(" - ");
                            const newValue = `${e.target.value} - ${
                              endTime || ""
                            }`;
                            setEditedEvent({
                              ...editedEvent,
                              [fieldName]: newValue,
                            });
                          }}
                          className={styles["edit-input"]}
                        />
                        <span> - </span>
                        <input
                          type="time"
                          value={value.split(" - ")[1]}
                          onChange={(e) => {
                            const [startTime] = value.split(" - ");
                            const newValue = `${startTime} - ${e.target.value}`;
                            setEditedEvent({
                              ...editedEvent,
                              [fieldName]: newValue,
                            });
                            setIsEventTimeChanged(true);
                          }}
                          className={styles["edit-input"]}
                        />
                      </>
                    ) : isEditMode && fieldName === "date" ? (
                      <>
                        <input
                          type="date"
                          value={value.split(" - ")[0]}
                          onChange={(e) => {
                            const [_, endTime] = value.split(" - ");
                            const newValue = `${e.target.value} - ${
                              endTime || ""
                            }`;
                            setEditedEvent({
                              ...editedEvent,
                              [fieldName]: newValue,
                            });
                          }}
                          className={styles["edit-input"]}
                        />
                        <span> - </span>
                        <input
                          type="date"
                          value={value.split(" - ")[1]}
                          onChange={(e) => {
                            const [startTime] = value.split(" - ");
                            const newValue = `${startTime} - ${e.target.value}`;
                            setEditedEvent({
                              ...editedEvent,
                              [fieldName]: newValue,
                            });
                            setIsEventTimeChanged(true);
                          }}
                          className={styles["edit-input"]}
                        />
                      </>
                    ) : isEditMode && fieldName === "status" ? (
                      <select
                        value={value}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setEditedEvent({
                            ...editedEvent,
                            [fieldName]: newValue,
                          });
                        }}
                        className={styles["edit-input"]}
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : isEditMode && fieldName === "chapter" ? (
                      <select
                        value={value}
                        onChange={(e) => {
                          setEditedEvent({
                            ...editedEvent,
                            [fieldName]: e.target.value,
                          });
                        }}
                        className={styles["edit-input"]}
                      >
                        {chapters.map((chapter) => (
                          <option key={chapter} value={chapter}>
                            {chapter}
                          </option>
                        ))}
                      </select>
                    ) : isEditMode ? (
                      <input
                        type={type || "text"}
                        value={value}
                        onChange={(e) => {
                          if (readOnly) return;
                          const newValue = e.target.value;
                          if (validate && !validate(newValue)) {
                            console.error(
                              "Invalid value for field: ",
                              fieldName
                            );
                            return;
                          }
                          setEditedEvent({
                            ...editedEvent,
                            [fieldName]: newValue,
                          });
                        }}
                        className={styles["edit-input"]}
                        readOnly={readOnly}
                      />
                    ) : (
                      <p className={styles["event-data"]}>{value.toString()}</p>
                    )}
                  </td>
                </tr>
              );
            })}
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
