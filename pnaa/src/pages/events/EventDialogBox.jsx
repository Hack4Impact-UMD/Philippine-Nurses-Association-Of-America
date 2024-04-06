import React, { useContext, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import styles from "./EventDialogBox.module.css";

import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase.ts";
import { useUser } from "../../config/UserContext";

const EventDialogBox = ({
  open,
  handleClose,
  eventName,
  eventId,
  dialogAction,
  onActionSuccess,
}) => {
  const buttonText = dialogAction === "archive" ? "Archive" : "Unarchive";
  const buttonColor = dialogAction === "archive" ? "#91201A" : "#14804A";

  const { currentUser, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);

  // Function to handle dialog box actions by toggling active field in Firestore and updating parent
  const handleDialogAction = async () => {
    const chapterId = currentUser?.chapterId;
    if (!chapterId) {
      console.error("Chapter ID not found");
      return;
    }

    setLoading(true);
    const eventRef = doc(db, "events", eventId);
    const newActiveStatus = dialogAction === "archive" ? true : false;

    try {
      await updateDoc(eventRef, {
        archived: newActiveStatus,
      });
      /*
      console.log(
        `Event ${
          dialogAction === "suspend" ? "suspended" : "renewed"
        } successfully.`
      );
      */
      // Call handler to update rendering in parent component
      onActionSuccess();
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      classes={{ paper: styles["dialog"] }}
    >
      <div className={styles["dialog-box-container"]}>
        <p className={styles["dialog-title"]}>CONFIRM SUSPENSION</p>
        <p className={styles["dialog-message"]}>
          Are you sure you want to {buttonText.toLowerCase()} this event?{" "}
        </p>
        <p className={styles["dialog-event-info"]}>
          {eventName} <br />
          {eventId}
        </p>
        <div className={styles["dialog-actions"]}>
          <Button
            variant="outlined"
            style={{
              color: "#464f60",
              fontFamily: "'Source Serif 4', serif",
              padding: "3px 12px",
              fontSize: "14px",
              borderRadius: "6px",
              borderColor: "#464f60",
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            style={{
              backgroundColor: buttonColor,
              color: "#fff",
              fontFamily: "'Source Serif 4', serif",
              fontSize: "14px",
              borderRadius: "6px",
              padding: "3px 12px",
              textTransform: "none",
            }}
            onClick={() => {
              handleDialogAction();
              handleClose();
            }}
            disabled={loading}
          >
            {loading ? "Loading..." : `${buttonText} Event`}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default EventDialogBox;
