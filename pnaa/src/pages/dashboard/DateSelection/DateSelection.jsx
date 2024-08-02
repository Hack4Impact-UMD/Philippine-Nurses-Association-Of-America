import { Button, Modal, Paper } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import styles from "./DateSelection.module.css";

const DateSelection = ({
  open,
  handleClose,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Paper className={styles.background}>
          <div className={styles.center}>
            <p className={styles.header}>Date Selection</p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                //   handleSubmit();
              }}
              className={styles.form}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={dayjs(startDate)}
                  onChange={(newDate) => setStartDate(newDate)}
                />
                <DatePicker
                  label="End Date"
                  value={dayjs(endDate)}
                  onChange={(newDate) => setEndDate(newDate)}
                />
              </LocalizationProvider>

              <Button
                variant="outlined"
                className={styles.confirmButton}
                onClick={() => {
                  handleClose();
                }}>
                Confirm
              </Button>
            </form>
          </div>
        </Paper>
      </Modal>
    </>
  );
};
export default DateSelection;
