import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFundraisingData } from "../../backend/FirestoreCalls";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import SignOutButton from "../../components/SignOutButton/SignOutButton";
import FundraisingPopup from "./AddFundraising/FundraisingPopup/FundraisingPopup";
import styles from "./fundraising.module.css";
import {
  DataGridStyles,
  QuickSearchToolbar,
  columns,
} from "./FundraisingUtils";

const Fundraising = () => {
  const [fundraisingData, setFundraisingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [showArchived, setShowArchived] = useState(true);
  const [selectedRow, setSelectedRow] = useState([]);
  const navigate = useNavigate();
  //Fetches all member data within chapter
  useEffect(() => {
    getFundraisingData()
      .then(async (result) => {
        setFundraisingData(result);
      })
      .catch((error) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const gridAPI = useGridApiRef();
  return (
    <div>
      <FundraisingPopup
        open={openPopup}
        mode="Delete"
        handleClose={() => {
          setOpenPopup(false);
        }}
        deleteList={selectedRow}
      />
      <div className={styles.header}>
        <h1>Fundraising Details</h1>
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
                label="Show Archived Fundraisers"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.875rem",
                  },
                }}
              />
              <div>
                <Button
                  className={styles.deleteButton}
                  onClick={() => setOpenPopup(true)}
                  disabled={selectedRow?.length == 0}
                  sx={{
                    "&.Mui-disabled": {
                      backgroundColor: "gray !important",
                    },
                  }}
                >
                  Delete Fundraisers
                </Button>
                <Button
                  className={styles.addButton}
                  onClick={() => navigate("../add-fundraising")}
                >
                  Add Fundraiser
                </Button>
              </div>
            </div>
            <DataGrid
              checkboxSelection
              apiRef={gridAPI}
              rows={
                showArchived
                  ? fundraisingData
                  : fundraisingData.filter((row) => !row.fundraising.archived)
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
                navigate("../add-fundraising", { state: row.row });
              }}
              sx={DataGridStyles}
              onRowSelectionModelChange={(ids) => {
                setSelectedRow(ids);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Fundraising;
