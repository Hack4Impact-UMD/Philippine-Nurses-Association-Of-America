import { useEffect, useState } from "react";
import Pencil from "../../assets/pencil.svg";
import { useAuth } from "../../auth/AuthProvider";
import { getUserById } from "../../backend/FirestoreCalls";
import Loading from "../../components/LoadingScreen/Loading";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import SignOutButton from "../../components/SignOutButton/SignOutButton";
import ChangePassword from "./ChangePassword/ChangePassword";
import styles from "./Settings.module.css";

const Settings = () => {
  const auth = useAuth();
  const [user, setUser] = useState();
  const [status, setStatus] = useState({
    loading: true,
    error: false,
  });
  const [openChangeEmailModal, setOpenChangeEmailModal] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  useEffect(() => {
    if (auth.user) {
      getUserById(auth.user.uid)
        .then((result) => {
          if (result.length > 0) {
            setUser(result[0]);
            setStatus({ loading: false, error: false });
          } else {
            setStatus({ loading: false, error: true });
          }
        })
        .catch((error) => {
          setStatus({ loading: false, error: true });
        });
    }
  }, [auth]);
  return (
    <div>
      <ChangePassword
        open={openChangePasswordModal}
        handleClose={() => setOpenChangePasswordModal(false)}
      />
      <div className={styles.header}>
        <h1>Settings</h1>
        <SignOutButton />
      </div>
      <NavigationBar />
      <div className={styles.content}>
        {status.loading ? (
          "Loading Data"
        ) : status.error ? (
          "Error fetching data"
        ) : (
          <div className={styles.profileContainer}>
            <div className={styles.inputContainer}>
              <div className={styles.inputHeader}>Name</div>
              <p className={styles.name}>{user?.name}</p>
            </div>
            <div className={styles.inputContainer}>
              <div className={styles.inputHeader}>Email</div>
              <div className={styles.inputLine}>
                <input className={styles.input} value={user?.email} disabled />
                <button
                  className={styles.editButton}
                  onClick={() => {
                    setOpenChangeEmailModal(true);
                  }}
                >
                  <img src={Pencil} className={styles.editImage}></img>
                </button>
              </div>
            </div>
            <div className={styles.inputContainer}>
              <div className={styles.inputHeader}>Password</div>
              <div className={styles.inputLine}>
                <input
                  type="text"
                  className={styles.input}
                  value="*********"
                  disabled
                />
                <button
                  className={styles.editButton}
                  onClick={() => {
                    setOpenChangePasswordModal(true);
                  }}
                >
                  <img src={Pencil} className={styles.editImage}></img>
                </button>
              </div>
            </div>
            <div className={styles.buttonMargin}>
              <button
                className={styles.deleteButton}
                onClick={() => {
                  setOpenDeleteModal(true);
                }}
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  return (
    <>
      {/* <ChangeEmail
        open={openChangeEmailModal}
        handleClose={() => setOpenChangeEmailModal(false)}
      />
      <ChangePassword
        open={openChangePasswordModal}
        handleClose={() => setOpenChangePasswordModal(false)}
      /> */}
      {/* <DeleteUser
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
      /> */}

      <NavigationBar />
      <div className={styles.background}>
        {status.loading ? (
          <Loading />
        ) : status.error ? (
          "Error fetching your data"
        ) : (
          <div className={styles.contentContainer}>
            <div className={styles.header}>Settings</div>
            <div className={styles.profileContainer}>
              <div className={styles.inputContainer}>
                <div className={styles.inputHeader}>Full Name</div>
                <p className={styles.name}>{user?.name}</p>
              </div>
              <div className={styles.inputContainer}>
                <div className={styles.inputHeader}>Email</div>
                <div className={styles.inputLine}>
                  <input
                    className={styles.input}
                    value={user?.email}
                    disabled
                  />
                  <button
                    className={styles.editButton}
                    onClick={() => {
                      setOpenChangeEmailModal(true);
                    }}
                  >
                    {/*<img src={} className={styles.editImage}></img> */}
                  </button>
                </div>
              </div>
              <div className={styles.inputContainer}>
                <div className={styles.inputHeader}>Password</div>
                <div className={styles.inputLine}>
                  <input
                    type="text"
                    className={styles.input}
                    value="*********"
                    disabled
                  />
                  <button
                    className={styles.editButton}
                    onClick={() => {
                      setOpenChangePasswordModal(true);
                    }}
                  >
                    {/*<img src={} className={styles.editImage}></img> */}
                  </button>
                </div>
              </div>
              <div className={styles.buttonMargin}>
                <button
                  className={styles.deleteButton}
                  onClick={() => {
                    setOpenDeleteModal(true);
                  }}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Settings;
