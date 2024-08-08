import { Button, Paper, TextField, Tooltip } from "@mui/material";

import {
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import { Description } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import archive from "../../../assets/archive.svg";
import pencil from "../../../assets/pencil.svg";
import save from "../../../assets/save.svg";
import x from "../../../assets/x.svg";

import deleteIcon from "../../../assets/trash.svg";
import unarchive from "../../../assets/unarchive.svg";
import { useAuth } from "../../../auth/AuthProvider";
import {
  getChapterRegionData,
  getUserById,
} from "../../../backend/FirestoreCalls";
import Loading from "../../../components/LoadingScreen/Loading";
import NavigationBar from "../../../components/NavigationBar/NavigationBar";
import SignOutButton from "../../../components/SignOutButton/SignOutButton";
import styles from "./AddEvent.module.css";
import EventPopup from "./EventPopup/EventPopup";
const mimeTypes = {
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  mp3: "audio/mpeg",
  mp4: "video/mp4",
  png: "image/png",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ppt: "application/vnd.ms-powerpoint",
  gif: "image/gif",
  csv: "text/csv",
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  txt: "text/plain",
  xml: "application/xml",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};
const AddEvent = () => {
  const auth = useAuth();
  const location = useLocation();
  const { state } = location;
  const formRef = useRef();
  const [userName, setUserName] = useState("");
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chapterSearch, setChapterSearch] = useState("");
  const [event, setEvent] = useState({
    startDate:
      state?.event?.startDate || new Date().toISOString().split("T")[0],
    endDate: state?.event?.endDate || new Date().toISOString().split("T")[0],
    startTime: state?.event?.startTime || "12:00:00",
    endTime: state?.event?.endTime || "12:00:00",
    location: state?.event?.location || "",
    chapter: state?.event?.chapter || "",
    region: state?.event?.region || "",
    about: state?.event?.about || "",
    eventPoster: state?.event?.eventPoster || {
      name: "",
      ref: "",
      downloadURL: "",
    },
    attendees: state?.event?.attendees || 0,
    volunteers: state?.event?.volunteers || 0,
    participantsServed: state?.event?.participantsServed || 0,
    contactHours: state?.event?.contactHours || 0,
    volunteerHours: state?.event?.volunteerHours || 0,
    otherDetails: state?.event?.otherDetails || "",
    archived: state?.event?.archived || false,
    lastUpdated: state?.event?.lastUpdated || "",
    lastUpdatedUser: state?.event?.lastUpdatedUser || "",
    creationDate: state?.event?.creationDate || "",
    name: state?.event?.name || "",
  });
  const [editMode, setEditMode] = useState(state ? false : true);
  // Popup Related useStates
  const [mode, setMode] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [deletedFile, setDeletedFile] = useState("");
  const style = {
    width: "340px",
    padding: "10px",
    fontFamily: "Source-Serif 4, serif",
    WebkitTextFillColor: "black",
  };
  useEffect(() => {
    setLoading(true);
    getChapterRegionData()
      .then((res) => {
        setChapters(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    if (auth.user) {
      getUserById(auth.user.uid)
        .then((res) => {
          setUserName(res[0].name);
        })
        .catch((e) => {});
    }
  }, [auth.loading]);

  const handleAddSubmit = () => {
    if (formRef?.current?.reportValidity()) {
      if (!state) {
        setMode("Add");
      } else {
        setMode("Edit");
      }
      setOpenPopup(true);
    }
  };
  return (
    <div>
      <EventPopup
        open={openPopup}
        mode={mode}
        user={userName}
        handleClose={() => {
          setOpenPopup(false);
          setMode("");
        }}
        event={event}
        id={state?.id}
        deletedFile={deletedFile}
      />
      <div className={styles.header}>
        <h1>Event Details</h1>
        <SignOutButton />
      </div>
      <NavigationBar />
      {loading ? (
        <div className={styles.gridContainer}>
          {" "}
          <Loading />
        </div>
      ) : (
        <div className={styles.gridContainer}>
          <Paper className={styles.paper}>
            <div className={styles.secondHeader}>
              <h1>{!state ? "Add Event" : "Event Information"}</h1>
              <div className={styles.buttons}>
                {!editMode ? (
                  <>
                    <Button
                      className={styles.submitButton}
                      type="submit"
                      onClick={() => {
                        setMode("Delete");
                        setOpenPopup(true);
                      }}
                    >
                      <Tooltip title={"Delete Event"}>
                        <img src={deleteIcon} className={styles.saveImg}></img>
                      </Tooltip>
                    </Button>
                    <Button
                      className={styles.submitButton}
                      onClick={() => {
                        if (event.archived) {
                          setMode("Unarchive");
                        } else {
                          setMode("Archive");
                        }
                        setOpenPopup(true);
                      }}
                    >
                      <Tooltip
                        title={
                          event.archived ? "Unarchive Event" : "Archive Event"
                        }
                      >
                        <img
                          src={event.archived ? unarchive : archive}
                          className={styles.saveImg}
                        ></img>
                      </Tooltip>
                    </Button>
                  </>
                ) : (
                  <></>
                )}
                <Button
                  className={styles.submitButton}
                  type="submit"
                  onClick={() => {
                    if (editMode) {
                      handleAddSubmit();
                    } else {
                      setEditMode(true);
                    }
                  }}
                >
                  <Tooltip title={editMode ? "Save Event" : "Edit Event"}>
                    <img
                      src={editMode ? save : pencil}
                      className={styles.saveImg}
                    ></img>
                  </Tooltip>
                </Button>
              </div>
            </div>
            <form className={styles.body} ref={formRef}>
              <div className={styles.formColumn}>
                <TextField
                  required
                  label="Event Name"
                  placeholder="Enter Event Name"
                  value={event.name}
                  onChange={(e) => {
                    setEvent({
                      ...event,
                      name: e.target.value,
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    style,
                    readOnly: !editMode,
                  }}
                  className={styles.muInput}
                />
                <TextField
                  required
                  label="Event Location"
                  placeholder="Enter Event Location"
                  value={event.location}
                  onChange={(e) => {
                    setEvent({
                      ...event,
                      location: e.target.value,
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    style,
                    readOnly: !editMode,
                  }}
                  className={styles.muInput}
                />
                <TextField
                  required
                  label="Event Attendees"
                  placeholder="Enter Number of Attendees"
                  value={event.attendees}
                  onChange={(e) => {
                    setEvent({
                      ...event,
                      attendees: e.target.value,
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    style,
                    readOnly: !editMode,
                  }}
                  className={styles.muInput}
                  type="number"
                />
                <TextField
                  required
                  label="Event Volunteers"
                  placeholder="Enter Number of Volunteers"
                  value={event.volunteers}
                  onChange={(e) => {
                    setEvent({
                      ...event,
                      volunteers: e.target.value,
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    style,
                    readOnly: !editMode,
                  }}
                  className={styles.muInput}
                  type="number"
                />
                <TextField
                  required
                  label="Event Participants"
                  placeholder="Enter Number of Participants"
                  value={event.participantsServed}
                  onChange={(e) => {
                    setEvent({
                      ...event,
                      participantsServed: e.target.value,
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    style,
                    readOnly: !editMode,
                  }}
                  className={styles.muInput}
                  type="number"
                />
                <TextField
                  required
                  label="Event Volunteer Hours"
                  placeholder="Enter Number of Volunteer Hours"
                  value={event.volunteerHours}
                  onChange={(e) => {
                    setEvent({
                      ...event,
                      volunteerHours: e.target.value,
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    style,
                    readOnly: !editMode,
                  }}
                  className={styles.muInput}
                  type="number"
                />

                <TextField
                  required
                  label="Event Contact Hours"
                  placeholder="Enter Number of Contact Hours"
                  value={event.contactHours}
                  onChange={(e) => {
                    setEvent({
                      ...event,
                      contactHours: e.target.value,
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    style,
                    readOnly: !editMode,
                  }}
                  className={styles.muInput}
                  type="number"
                />
                <TextField
                  label="About"
                  placeholder="Enter Event Description"
                  value={event.about}
                  onChange={(e) => {
                    setEvent({
                      ...event,
                      about: e.target.value,
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    style,
                    readOnly: !editMode,
                  }}
                  className={`${styles.muInput} ${styles.tripleHeight}`}
                  multiline
                  minRows={3}
                  maxRows={3}
                  required
                />

                {!editMode ? (
                  <div className={styles.editInfo}>
                    {" "}
                    <TextField
                      required
                      label="Last Updated"
                      value={
                        new Date(event.lastUpdated.seconds * 1000)
                          .toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })
                          .toString() + " EST"
                      }
                      InputLabelProps={{ shrink: true }}
                      inputProps={{
                        style,
                        readOnly: true,
                      }}
                      className={styles.muInput}
                    />
                    <TextField
                      required
                      label="User that Last Updated"
                      value={event.lastUpdatedUser}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{
                        style,
                        readOnly: true,
                      }}
                      className={styles.muInput}
                    />
                    <TextField
                      required
                      label="Creation Date"
                      value={
                        new Date(event.creationDate.seconds * 1000)
                          .toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })
                          .toString() + " EST"
                      }
                      InputLabelProps={{ shrink: true }}
                      inputProps={{
                        style,
                        readOnly: true,
                      }}
                      className={styles.muInput}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className={styles.formColumn}>
                {!editMode ? (
                  <TextField
                    required
                    label="Archived Status"
                    value={event.archived ? "Archived" : "Not Archived"}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      style,
                      readOnly: true,
                    }}
                    className={styles.muInput}
                  />
                ) : (
                  <></>
                )}
                {/* Chapter Name Select */}
                <FormControl variant="outlined">
                  <InputLabel
                    id="primary-test-select-label"
                    className={styles.selectInput}
                    required
                  >
                    Chapter Name
                  </InputLabel>
                  <Select
                    required
                    labelId="primary-test-select-label"
                    // Disables auto focus on MenuItems and allows TextField to be in focus
                    MenuProps={{
                      PaperProps: { sx: { maxHeight: 300 } },
                    }}
                    value={event.chapter}
                    onChange={(e) => {
                      if (!editMode) {
                        return;
                      }
                      const region = Object.keys(chapters).find((key) => {
                        return chapters[key].includes(e.target.value);
                      });

                      setEvent({
                        ...event,
                        chapter: e.target.value,
                        region: region,
                      });
                    }}
                    onClose={() => setChapterSearch("")}
                    // This prevents rendering empty string in Select's value
                    // if search text would exclude currently selected option.
                    renderValue={() => event.chapter}
                    className={styles.primarySelect}
                    variant="outlined"
                  >
                    {/* TextField is put into ListSubheader so that it doesn't
              act as a selectable item in the menu
              i.e. we can click the TextField without triggering any selection.*/}
                    <ListSubheader>
                      <TextField
                        size="small"
                        // Autofocus on textfield
                        autoFocus
                        placeholder="Type to search..."
                        fullWidth
                        onChange={(e) => setChapterSearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key !== "Escape") {
                            // Prevents autoselecting item while typing (default Select behaviour)
                            e.stopPropagation();
                          }
                        }}
                      />
                    </ListSubheader>
                    {Object.values(chapters)
                      .flat(Infinity)
                      .map((option, i) =>
                        option
                          .toLowerCase()
                          .indexOf(chapterSearch.toLowerCase()) > -1 ? (
                          <MenuItem key={i} value={option}>
                            {option}
                          </MenuItem>
                        ) : (
                          <></>
                        )
                      )}
                  </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterLuxon}>
                  <DatePicker
                    label="Start Date"
                    onChange={(e) => {
                      setEvent({
                        ...event,
                        startDate: e.toSQL().split(" ")[0],
                      });
                    }}
                    value={DateTime.fromSQL(event.startDate)}
                    className={`${styles.muInput} ${styles.dateTime}`}
                    readOnly={!editMode}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterLuxon}>
                  <DatePicker
                    label="End Date"
                    minDate={DateTime.fromSQL(event.startDate)}
                    onChange={(e) => {
                      setEvent({
                        ...event,
                        endDate: e.toSQL().split(" ")[0],
                      });
                    }}
                    value={DateTime.fromSQL(event.endDate)}
                    inputProps={{
                      style,
                    }}
                    className={`${styles.muInput} ${styles.dateTime}`}
                    readOnly={!editMode}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterLuxon}>
                  <TimePicker
                    label="Start Time"
                    onChange={(e) => {
                      setEvent({
                        ...event,
                        startTime: e.toSQL().split(" ")[1],
                      });
                    }}
                    value={DateTime.fromSQL(event.startTime)}
                    className={`${styles.muInput} ${styles.dateTime}`}
                    readOnly={!editMode}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterLuxon}>
                  <TimePicker
                    label="End Time"
                    minTime={
                      event.startDate == event.endDate
                        ? DateTime.fromSQL(event.startTime)
                        : null
                    }
                    onChange={(e) => {
                      setEvent({
                        ...event,
                        endTime: e.toSQL().split(" ")[1],
                      });
                    }}
                    value={DateTime.fromSQL(event.endTime)}
                    className={`${styles.muInput} ${styles.dateTime}`}
                    readOnly={!editMode}
                  />
                </LocalizationProvider>

                <TextField
                  label="Other Details"
                  placeholder="Enter Other Details"
                  value={event.otherDetails}
                  onChange={(e) => {
                    setEvent({
                      ...event,
                      otherDetails: e.target.value,
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    style,
                    readOnly: !editMode,
                  }}
                  className={`${styles.muInput} ${styles.tripleHeight}`}
                  multiline
                  minRows={3}
                  maxRows={3}
                  required
                />
                {event.eventPoster.downloadURL ? (
                  <div className={styles.fileDeleteRow}>
                    <a
                      href={event.eventPoster.downloadURL}
                      className={styles.informationText}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Description />
                      {event.eventPoster.name.length > 30
                        ? event.eventPoster.name.substring(0, 28) +
                          ". . . " +
                          event.eventPoster.name.substring(
                            event.eventPoster.name.indexOf(".") - 3
                          )
                        : event.eventPoster.name}
                    </a>
                    {editMode && (
                      <button
                        onClick={() => {
                          setDeletedFile(event.eventPoster.ref);
                          setEvent({
                            ...event,
                            eventPoster: { name: "", ref: "", downloadURL: "" },
                          });
                        }}
                        className={styles.xButton}
                      >
                        <img
                          className={styles.icon}
                          alt="Delete Icon"
                          src={x}
                        />
                      </button>
                    )}
                  </div>
                ) : (
                  <></>
                )}
                {editMode && !event.eventPoster.downloadURL ? (
                  <>
                    <label htmlFor="upload" className={styles.editButton}>
                      Upload Event Poster
                    </label>
                    <input
                      type="file"
                      id="upload"
                      accept=".csv, .doc, .docx, .gif, .jpeg, .jpg, .mp3, .mp4, .pdf, .png, .ppt, .pptx, .txt, .xls, .xlsx, .xml"
                      onChange={async (e) => {
                        const maxFileSize = 1048576 * 20; // 20MB
                        if (e.target.files) {
                          const currFile = e.target.files[0];
                          if (!currFile?.size) {
                            return;
                          }
                          if (currFile?.size > maxFileSize) {
                            alert("File is too big");
                            e.target.value = "";
                            return;
                          }
                          const exten = currFile.name.split(".").pop();
                          if (
                            !currFile.name.includes(".") ||
                            mimeTypes[exten] != currFile.type
                          ) {
                            alert("File extension does not match file type");
                            e.target.value = "";
                            return;
                          }
                          currFile.downloadURL = URL.createObjectURL(currFile);
                          const fileContent = await currFile.arrayBuffer();

                          setEvent({
                            ...event,
                            eventPoster: {
                              name: currFile.name,
                              downloadURL: "",
                              content: fileContent,
                              ref: "",
                            },
                          });
                        }
                      }}
                      className={styles.fileInput}
                    />
                  </>
                ) : (
                  <></>
                )}
              </div>
            </form>
          </Paper>
        </div>
      )}
    </div>
  );
};

export default AddEvent;
