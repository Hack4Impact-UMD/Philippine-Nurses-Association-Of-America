import { Button, Modal, Paper } from "@mui/material";
import { useState } from "react";
import DeleteUser from "./DeleteUser/DeleteUser";
import styles from "./EditUser.module.css";

const EditUser = ({ user, open, handleClose, handleOpenAdd }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openChangeRoleModal, setOpenChangeRoleModal] = useState(false);

  return (
    <>
      <DeleteUser
        user={user?.user}
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
      />
      <Modal open={open} onClose={handleClose}>
        <Paper className={styles.background}>
          <div className={styles.center}>
            <p className={styles.header}>Edit Existing User</p>

            <Button
              type="submit"
              variant="outlined"
              className={styles.submitButton}
              onClick={() => {
                handleClose();
                handleOpenAdd();
              }}
            >
              Edit User
            </Button>
            <Button
              type="submit"
              variant="outlined"
              className={styles.submitButton}
              onClick={() => {
                setOpenDeleteModal(true);
                handleClose();
              }}
            >
              Delete User
            </Button>
          </div>
        </Paper>
      </Modal>
    </>
  );
};
export default EditUser;
