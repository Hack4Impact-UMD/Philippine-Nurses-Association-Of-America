import { Button, Modal, Paper } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addFundraiser,
  deleteFundraiser,
  updateFundraiser,
} from "../../../../backend/FirestoreCalls";
import Loading from "../../../../components/LoadingScreen/Loading";
import styles from "./FundraisingPopup.module.css";

const FundraisingPopup = ({
  mode,
  user,
  fundraiser,
  open,
  handleClose,
  id,
  deleteList,
}) => {
  const [status, setStatus] = useState({
    loading: false,
    error: false,
    submitted: false,
  });

  const navigate = useNavigate();
  const handleSubmit = () => {
    setStatus({ ...status, loading: true });
    let promise = undefined;
    if (mode == "Add") {
      promise = addFundraiser({
        ...fundraiser,
        lastUpdated: new Date(),
        creationDate: new Date(),
        lastUpdatedUser: user,
      });
    } else if (mode == "Edit") {
      promise = updateFundraiser(
        {
          ...fundraiser,
          lastUpdated: new Date(),
          lastUpdatedUser: user,
        },
        id
      );
    } else if (mode == "Archive") {
      promise = updateFundraiser(
        {
          ...fundraiser,
          archived: true,
          lastUpdated: new Date(),
          lastUpdatedUser: user,
        },
        id
      );
    } else if (mode == "Unarchive") {
      promise = updateFundraiser(
        {
          ...fundraiser,
          archived: false,
          lastUpdated: new Date(),
          lastUpdatedUser: user,
        },
        id
      );
    } else if (mode == "Delete") {
      if (deleteList) {
        promise = Promise.all(
          deleteList.map((id) => {
            return deleteFundraiser(id);
          })
        );
      } else {
        promise = deleteFundraiser(id);
      }
    }
    promise
      .then(() => {
        setStatus({ loading: false, error: false, submitted: true });
      })
      .catch((error) => {
        console.log(error);
        setStatus({ loading: false, error: true, submitted: true });
      });
  };
  const handleFullClose = () => {
    if (status.submitted && !status.error) {
      if (mode == "Add" || mode == "Delete") {
        navigate("../fundraising");
        if (deleteList) {
          window.location.reload();
        }
      } else if (mode == "Edit" || mode == "Archive" || mode == "Unarchive") {
        navigate("../add-fundraising", {
          state: {
            fundraising: {
              ...fundraiser,
              archived:
                mode == "Edit" ? fundraiser.archived : mode == "Archive",
              lastUpdated: new Date(),
              lastUpdatedUser: user,
            },
            id: id,
          },
        });
        // Navigating to the same page doesn't reload, so we reload manually
        window.location.reload();
      }
    } else {
      setStatus({ loading: false, error: false, submitted: false });
      handleClose();
    }
  };
  return (
    <>
      <Modal open={open} onClose={handleFullClose}>
        <Paper className={styles.background}>
          <div className={styles.center}>
            <p className={styles.header}>{mode} Fundraiser</p>
            {status.submitted ? (
              <p className={styles.text}>
                {status.error
                  ? "An error occurred. Please try again later."
                  : `Success! ${
                      mode == "Add" || mode == "Delete"
                        ? "Upon closing this, you will be redirected to the main fundraising page."
                        : mode == "Edit" ||
                          mode == "Archive" ||
                          mode == "Unarchive"
                        ? "Upon closing this, the page will be reloaded."
                        : ""
                    }`}
              </p>
            ) : (
              <p className={styles.text}>
                Are you sure you want to{" "}
                {mode == "Add"
                  ? "create a new"
                  : mode == "Edit"
                  ? " edit the"
                  : mode == "Archive"
                  ? "archive"
                  : mode == "Unarchive"
                  ? "unarchive"
                  : mode == "Delete"
                  ? "delete the"
                  : ""}{" "}
                fundraiser
                {mode == "Delete" && deleteList && deleteList.length > 1
                  ? "s"
                  : ""}
                ?
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
                {mode} Fundraiser
                {mode == "Delete" && deleteList && deleteList.length > 1
                  ? "s"
                  : ""}
              </Button>
            )}
          </div>
        </Paper>
      </Modal>
    </>
  );
};
export default FundraisingPopup;
