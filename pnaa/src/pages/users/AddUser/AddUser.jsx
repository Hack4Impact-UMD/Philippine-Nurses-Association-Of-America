import {
  Button,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { createUser } from "../../../backend/AuthFunctions";
import { updateUser } from "../../../backend/FirestoreCalls";
import Loading from "../../../components/LoadingScreen/Loading";
import styles from "./AddUser.module.css";

const AddUser = ({ open, handleClose, user }) => {
  const style = {
    width: "250px",
    padding: "10px 10px 10px 10px",
    fontFamily: "'Inter', sans-serif",
  };
  const [fields, setFields] = useState({
    name: user?.user?.name || "",
    email: user?.user?.email || "",
    chapterName: user?.user?.chapterName || "",
    role: user?.user?.type.toUpperCase() || "USER",
  });
  const [status, setStatus] = useState({
    loading: false,
    error: false,
    errorMessage: "",
  });

  useEffect(() => {
    setFields({
      name: user?.user?.name || "",
      email: user?.user?.email || "",
      chapterName: user?.user?.chapterName || "",
      role: user?.user?.type.toUpperCase() || "USER",
    });
  }, [user]);
  const handleSubmit = () => {
    setStatus({ ...status, loading: true });
    if (user) {
      updateUser(
        { name: fields.name, chapterName: fields.chapterName },
        user.id
      )
        .then(() =>
          setStatus({ ...status, loading: true, errorMessage: "none" })
        )
        .catch((error) => {
          setStatus({
            error: true,
            errorMessage: error?.message || "Error",
            loading: false,
          });
        });
    } else {
      createUser(
        fields.name,
        fields.chapterName,
        fields.email,
        fields.role.toUpperCase()
      )
        .then(() =>
          setStatus({ ...status, loading: true, errorMessage: "none" })
        )
        .catch((error) => {
          setStatus({
            error: true,
            errorMessage: error?.message || "Error",
            loading: false,
          });
        });
    }
  };
  const handleFullClose = () => {
    setFields({
      name: "",
      email: "",
      chapterName: "",
      role: "USER",
    });
    setStatus({ loading: false, error: false, errorMessage: "" });
    handleClose();
    if (!status.error && status.errorMessage == "none") {
      window.location.reload();
    }
  };
  return (
    <>
      <Modal open={open} onClose={handleFullClose}>
        <Paper className={styles.background}>
          {status.error ? (
            <div className={styles.center}>{status.errorMessage}</div>
          ) : status.errorMessage == "none" ? (
            <div className={styles.center}>
              User {user ? "updated" : "created"} successfully
            </div>
          ) : (
            <>
              <p className={styles.header}>
                {user ? "Edit User" : "Create New User"}
              </p>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSubmit();
                }}
                className={styles.form}
              >
                <TextField
                  required
                  label="Name"
                  placeholder="Enter Name"
                  value={fields.name}
                  onChange={(event) => {
                    setFields({ ...fields, name: event.target.value });
                  }}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    style,
                  }}
                  className={styles.muInput}
                />
                <TextField
                  required
                  label="Chapter Name"
                  placeholder="Enter Chapter Name"
                  value={fields.chapterName}
                  onChange={(event) => {
                    setFields({ ...fields, chapterName: event.target.value });
                  }}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    style,
                  }}
                  className={styles.muInput}
                />

                {!user && (
                  <>
                    <TextField
                      required
                      label="Email"
                      placeholder="Enter Email"
                      type="email"
                      value={fields.email}
                      onChange={(event) => {
                        setFields({ ...fields, email: event.target.value });
                      }}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{
                        style,
                      }}
                      className={styles.muiInput}
                    />
                    <Select
                      value={fields.role}
                      onChange={(event) => {
                        setFields({ ...fields, role: event.target.value });
                      }}
                      sx={{
                        width: "150px",
                        "& .MuiSelect-select": {
                          paddingRight: 4,
                          paddingLeft: 2,
                          paddingTop: 1,
                          paddingBottom: 1,
                          textAlign: "center",
                        },
                      }}
                      className={styles.select}
                    >
                      <MenuItem value={"USER"}>User</MenuItem>
                      <MenuItem value={"ADMIN"}>Admin</MenuItem>
                    </Select>
                  </>
                )}

                <Button
                  type="submit"
                  variant="outlined"
                  className={styles.submitButton}
                >
                  {status.loading ? <Loading /> : "Submit"}
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Modal>
    </>
  );
};
export default AddUser;
