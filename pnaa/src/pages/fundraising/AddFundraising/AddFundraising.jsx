import { Button, Paper, TextField, Tooltip } from "@mui/material";

import {
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import archive from "../../../assets/archive.svg";
import pencil from "../../../assets/pencil.svg";
import save from "../../../assets/save.svg";
import deleteIcon from "../../../assets/trash.svg";
import unarchive from "../../../assets/unarchive.svg";
import { useAuth } from "../../../auth/AuthProvider";
import { getChapters, getUserById } from "../../../backend/FirestoreCalls";
import Loading from "../../../components/LoadingScreen/Loading";
import NavigationBar from "../../../components/NavigationBar/NavigationBar";
import SignOutButton from "../../../components/SignOutButton/SignOutButton";
import styles from "./AddFundraising.module.css";
import FundraisingPopup from "./FundraisingPopup/FundraisingPopup";

const AddFundraising = () => {
  const auth = useAuth();
  const location = useLocation();
  const { state } = location;
  const formRef = useRef();
  const [userName, setUserName] = useState("");
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chapterSearch, setChapterSearch] = useState("");
  const [fundraiser, setFundraiser] = useState({
    date: state?.fundraising?.date || "",
    fundraiserName: state?.fundraising?.fundraiserName || "",
    chapterName: state?.fundraising?.chapterName || "",
    amount: state?.fundraising?.amount || 0,
    note: state?.fundraising?.note || "",
    archived: state?.fundraising?.archived || false,
    lastUpdated: state?.fundraising?.lastUpdated || "",
    lastUpdatedUser: state?.fundraising?.lastUpdatedUser || "",
    creationDate: state?.fundraising?.creationDate || "",
  });
  const [editMode, setEditMode] = useState(state ? false : true);
  // Popup Related useStates
  const [mode, setMode] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const style = {
    width: "340px",
    padding: "10px",
    fontFamily: "Source-Serif 4, serif",
    WebkitTextFillColor: "black",
  };
  useEffect(() => {
    setLoading(true);
    getChapters()
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
      <FundraisingPopup
        open={openPopup}
        mode={mode}
        user={userName}
        handleClose={() => {
          setOpenPopup(false);
          setMode("");
        }}
        fundraiser={fundraiser}
        id={state?.id}
      />
      <div className={styles.header}>
        <h1>Fundraising Details</h1>
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
              <h1>{!state ? "Add Fundraiser" : "Fundraiser Information"}</h1>
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
                      <Tooltip title={"Delete Fundraiser"}>
                        <img src={deleteIcon} className={styles.saveImg}></img>
                      </Tooltip>
                    </Button>
                    <Button
                      className={styles.submitButton}
                      onClick={() => {
                        if (fundraiser.archived) {
                          setMode("Unarchive");
                        } else {
                          setMode("Archive");
                        }
                        setOpenPopup(true);
                      }}
                    >
                      <Tooltip
                        title={
                          fundraiser.archived
                            ? "Unarchive Fundraiser"
                            : "Archive Fundraiser"
                        }
                      >
                        <img
                          src={fundraiser.archived ? unarchive : archive}
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
                  <Tooltip
                    title={editMode ? "Save Fundraiser" : "Edit Fundraiser"}
                  >
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
                  label="Fundraiser Name"
                  placeholder="Enter Fundraiser Name"
                  value={fundraiser.fundraiserName}
                  onChange={(event) => {
                    setFundraiser({
                      ...fundraiser,
                      fundraiserName: event.target.value,
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
                  label="Amount"
                  placeholder="Enter Fundraiser Amount"
                  value={fundraiser.amount}
                  onChange={(event) => {
                    setFundraiser({
                      ...fundraiser,
                      amount: event.target.value,
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

                {/* Date Select */}
                <input
                  type="date"
                  id="date"
                  value={fundraiser.date}
                  onChange={(e) => {
                    setFundraiser({ ...fundraiser, date: e.target.value });
                  }}
                  className={styles.dateInput}
                  required
                  disabled={!editMode}
                ></input>
                {!editMode ? (
                  <div className={styles.editInfo}>
                    {" "}
                    <TextField
                      required
                      label="Last Updated"
                      value={
                        new Date(fundraiser.lastUpdated.seconds * 1000)
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
                      value={fundraiser.lastUpdatedUser}
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
                        new Date(fundraiser.creationDate.seconds * 1000)
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
                    value={fundraiser.archived ? "Archived" : "Not Archived"}
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
                    value={fundraiser.chapterName}
                    onChange={(e) => {
                      if (!editMode) {
                        return;
                      }
                      setFundraiser({
                        ...fundraiser,
                        chapterName: e.target.value,
                      });
                    }}
                    onClose={() => setChapterSearch("")}
                    // This prevents rendering empty string in Select's value
                    // if search text would exclude currently selected option.
                    renderValue={() => fundraiser.chapterName}
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
                    {chapters.map((option, i) =>
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
                <TextField
                  label="Notes"
                  placeholder="Enter Notes"
                  value={fundraiser.note}
                  onChange={(event) => {
                    setFundraiser({
                      ...fundraiser,
                      note: event.target.value,
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
                  maxRows={8}
                />
              </div>
            </form>
          </Paper>
        </div>
      )}
    </div>
  );
};

export default AddFundraising;
