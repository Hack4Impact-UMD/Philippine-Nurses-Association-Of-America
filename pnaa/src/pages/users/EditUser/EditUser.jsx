import { Button, Modal, Paper } from "@mui/material";
import { useState } from "react";
import ChangeRole from "./ChangeRole/ChangeRole";
import DeleteUser from "./DeleteUser/DeleteUser";
import styles from "./EditUser.module.css";

const EditUser = ({ user, open, handleClose }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState < boolean > false;
  const [openChangeRoleModal, setOpenChangeRoleModal] =
    useState < boolean > false;

  return (
    <>
      <DeleteUser
        user={user}
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
      />
      <ChangeRole
        user={user}
        open={openChangeRoleModal}
        handleClose={() => setOpenChangeRoleModal(false)}
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
                setOpenChangeRoleModal(true);
                handleClose();
              }}
            >
              Make User an Admin
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
