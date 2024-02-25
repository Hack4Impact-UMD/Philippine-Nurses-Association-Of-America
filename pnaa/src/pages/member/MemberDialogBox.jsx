import React from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import styles from "./MemberDialogBox.module.css";

const MemberDialogBox = ({
  open,
  handleClose,
  memberName,
  memberId,
  dialogAction,
}) => {
  const buttonText = dialogAction === "suspend" ? "Suspend" : "Renew";
  const buttonColor = dialogAction === "suspend" ? "#91201A" : "#14804A";

  // Function to handle all possible dialog box actions
  const handleDialogAction = () => {
    if (dialogAction === "suspend") {
      // handle suspension logic here
    } else {
      // handle renewal logic here
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
          Are you sure you want to {buttonText.toLowerCase()} this member?{" "}
        </p>
        <p className={styles["dialog-member-info"]}>
          {memberName} <br />
          {memberId}
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
          >
            {buttonText} Member
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default MemberDialogBox;
