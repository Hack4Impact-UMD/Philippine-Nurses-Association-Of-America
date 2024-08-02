import { Paper, TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavigationBar from "../../../components/NavigationBar/NavigationBar";
import SignOutButton from "../../../components/SignOutButton/SignOutButton";
import styles from "./AddFundraising.module.css";

const AddFundraising = () => {
  const location = useLocation();
  const { state } = location;
  const [fundraiser, setFundraiser] = useState({
    date: state?.date || "",
    fundraiserName: state?.fundraiserName || "",
    chapterName: state?.chapterName || "",
    amount: state?.amount || 0,
    note: state?.note || "",
    archived: state?.archived || false,
    lastUpdated: state?.lastUpdated || "",
    lastUpdatedUser: state?.lastUpdatedUser || "",
    creationDate: state?.creationDate || "",
  });
  const navigate = useNavigate();
  const [chapterDetails, setChapterDetails] = useState();
  const style = {
    width: "250px",
    padding: "10px 10px 10px 10px",
    fontFamily: "Source-Serif 4, serif",
    WebkitTextFillColor: "black",
  };
  return (
    <div>
      <div className={styles.header}>
        <h1>Fundraising Details</h1>
        <SignOutButton />
      </div>
      <NavigationBar />
      <div className={styles.gridContainer}>
        <Paper className={styles.paper}>
          <div className={styles.secondHeader}>
            <h1>{!state ? "Add Fundraiser" : "Fundraiser Information"}</h1>
          </div>
          <div className={styles.body}>
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
                // readOnly: givenMode === "VIEW",
              }}
              className={styles.muInput}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Enter Event Date"
                value={fundraiser.date}
                onChange={(newValue) => {
                  console.log(newValue);
                  setFundraiser({ ...fundraiser, date: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      style: {
                        height: "15px",
                        padding: "0",
                        fontSize: "0.5rem",
                      },
                    }}
                    InputLabelProps={{
                      style: {
                        height: "15px",
                        padding: "0",
                        fontSize: "0.5rem",
                      },
                    }} // Adjusts label size
                    sx={{
                      "& .MuiInputBase-root": {
                        height: "15px", // Adjust the height of the input container
                        padding: "0",
                      },
                      "& .MuiInputBase-input": {
                        height: "15px", // Adjust the height of the input element
                        padding: "0 10px",
                        fontSize: "0.875rem",
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default AddFundraising;
