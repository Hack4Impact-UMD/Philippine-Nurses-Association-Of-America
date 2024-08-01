import { Button, Modal, Paper } from "@mui/material";
import { useState } from "react";
import styles from "./DeleteUser.module.css";

import { deleteUser } from "../../../../backend/AuthFunctions";
import Loading from "../../../../components/LoadingScreen/Loading";

const DeleteUser = ({ user, open, handleClose }) => {
  const [status, setStatus] = useState({
    loading: false,
    error: false,
    submitted: false,
  });
  const handleSubmit = () => {
    setStatus({ ...status, loading: true });
    deleteUser(user?.auth_id)
      .then(() => {
        setStatus({ loading: false, error: false, submitted: true });
      })
      .catch((error) => {
        setStatus({ loading: false, error: true, submitted: true });
      });
  };
  const handleFullClose = () => {
    if (status.submitted && !status.error) {
      window.location.reload();
    } else {
      setStatus({ loading: false, error: false, submitted: false });
      handleClose();
    }
  };
  console.log(user);
  return (
    <>
      <Modal open={open} onClose={handleFullClose}>
        <Paper className={styles.background}>
          <div className={styles.center}>
            <p className={styles.header}>Edit Existing User</p>
            {status.submitted ? (
              <p className={styles.text}>
                {status.error
                  ? "Error deleting user. Please try again later."
                  : "Successfully deleted user"}
              </p>
            ) : (
              <p className={styles.text}>
                Are you sure you want to delete the user with the email&nbsp;
                {user?.email}?
              </p>
            )}

            {status.loading ? (
              <Loading />
            ) : status.submitted ? (
              <></>
            ) : (
              <Button
                type="submit"
                variant="outlined"
                className={styles.submitButton}
                onClick={() => handleSubmit()}
              >
                Delete User
              </Button>
            )}
          </div>
        </Paper>
      </Modal>
    </>
  );
};
export default DeleteUser;
