import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "@firebase/storage";
import { Button, Modal, Paper } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addEvent,
  deleteEvent,
  updateEvent,
} from "../../../../backend/FirestoreCalls";
import Loading from "../../../../components/LoadingScreen/Loading";
import styles from "./EventPopup.module.css";

const EventPopup = ({
  mode,
  user,
  event,
  open,
  handleClose,
  id,
  deleteList,
  deletedFile,
}) => {
  const storage = getStorage();
  const [status, setStatus] = useState({
    loading: false,
    error: false,
    submitted: false,
  });
  const navigate = useNavigate();
  const handleSubmit = async () => {
    setStatus({ ...status, loading: true });
    let promise = undefined;
    if (mode == "Add") {
      if (event.eventPoster?.content) {
        const fileExtension = event.eventPoster.name.split(".").pop();
        // Upload file to firebase storage
        const randomName = crypto.randomUUID();

        const storageRef = ref(storage, randomName + "." + fileExtension);

        await uploadBytes(
          storageRef,
          new Uint8Array(event.eventPoster.content)
        );
        const downloadURL = await getDownloadURL(storageRef);
        event.eventPoster = {
          name: event.eventPoster.name,
          ref: randomName + "." + fileExtension,
          downloadURL: downloadURL,
        };
      }
      promise = addEvent({
        ...event,
        lastUpdated: new Date(),
        creationDate: new Date(),
        lastUpdatedUser: user,
      });
    } else if (mode == "Edit") {
      const promises = [];
      if (deletedFile) {
        const storage = getStorage();
        const pathReference = ref(storage, deletedFile);
        promises.push(deleteObject(pathReference));
      }
      if (event.eventPoster?.content) {
        const fileExtension = event.eventPoster.name.split(".").pop();
        // Upload file to firebase storage
        const randomName = crypto.randomUUID();

        const storageRef = ref(storage, randomName + "." + fileExtension);

        await uploadBytes(
          storageRef,
          new Uint8Array(event.eventPoster.content)
        );
        const downloadURL = await getDownloadURL(storageRef);
        event.eventPoster = {
          name: event.eventPoster.name,
          ref: randomName + "." + fileExtension,
          downloadURL: downloadURL,
        };
      }
      promises.push(
        updateEvent(
          {
            ...event,
            lastUpdated: new Date(),
            lastUpdatedUser: user,
          },
          id
        )
      );
      promise = Promise.all(promises);
    } else if (mode == "Archive") {
      promise = updateEvent(
        {
          ...event,
          archived: true,
          lastUpdated: new Date(),
          lastUpdatedUser: user,
        },
        id
      );
    } else if (mode == "Unarchive") {
      promise = updateEvent(
        {
          ...event,
          archived: false,
          lastUpdated: new Date(),
          lastUpdatedUser: user,
        },
        id
      );
    } else if (mode == "Delete") {
      if (deleteList) {
        promise = Promise.all(
          deleteList.map((row) => {
            return deleteEvent(row.ref, row.id);
          })
        );
      } else {
        promise = deleteEvent(event.eventPoster?.ref, id);
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
        navigate("../events");
        if (deleteList) {
          window.location.reload();
        }
      } else if (mode == "Edit" || mode == "Archive" || mode == "Unarchive") {
        navigate("../add-event", {
          state: {
            event: {
              ...event,
              archived: mode == "Edit" ? event.archived : mode == "Archive",
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
            <p className={styles.header}>{mode} Event</p>
            {status.submitted ? (
              <p className={styles.text}>
                {status.error
                  ? "An error occurred. Please try again later."
                  : `Success! ${
                      mode == "Add" || mode == "Delete"
                        ? "Upon closing this, you will be redirected to the main events page."
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
                  ? "archive the "
                  : mode == "Unarchive"
                  ? "unarchive the "
                  : mode == "Delete"
                  ? "delete the"
                  : ""}{" "}
                event{deleteList && deleteList.length > 1 ? "s" : ""}?
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
                {mode} Event{deleteList && deleteList.length > 1 ? "s" : ""}
              </Button>
            )}
          </div>
        </Paper>
      </Modal>
    </>
  );
};
export default EventPopup;
