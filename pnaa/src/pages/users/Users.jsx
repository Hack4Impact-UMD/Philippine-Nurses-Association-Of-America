import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import SignOutButton from "../../components/SignOutButton/SignOutButton";
import styles from "./Users.module.css";
import {
  DataGridStyles,
  QuickSearchToolbar,
  columns,
} from "./UsersDetailsUtils";

import { getUsersData } from "../../backend/FirestoreCalls";
import AddUser from "./AddUser/AddUser";
import EditUser from "./EditUser/EditUser";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState({
    user: undefined,
    open: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    getUsersData()
      .then((foundUsers) => {
        console.log(foundUsers);
        setUsers(foundUsers);
      })
      .catch((error) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <AddUser
        open={openAddModal}
        user={selectedUser}
        handleClose={() => {
          setOpenAddModal(false);
          setSelectedUser(undefined);
        }}
      />
      <EditUser
        user={openEditModal.user}
        open={openEditModal.open}
        handleClose={() => setOpenEditModal({ ...openEditModal, open: false })}
        handleOpenAdd={() => {
          setOpenAddModal(true);
          setSelectedUser(openEditModal.user);
        }}
      />
      <div className={styles.header}>
        <h1>Users</h1>
        <SignOutButton />
      </div>
      <NavigationBar />
      <div className={styles.content}>
        <div className={styles.usersBtns}>
          {/* <button
            onClick={() => {}}
            className={`${styles["events-delete-btn"]} ${
              selectedRows.length === 0
                ? styles["events-delete-btn-disabled"]
                : ""
            }`}
            disabled={selectedRows.length === 0}
          >
            Delete User
          </button> */}
          <button
            onClick={() => setOpenAddModal(true)}
            className={styles.usersAddBtn}
          >
            Add User
          </button>
        </div>
        <div className={styles.gridContainer}>
          {loading ? (
            "Loading Data"
          ) : error ? (
            "Error fetching data"
          ) : (
            <div className={styles.innerGrid}>
              <DataGrid
                rows={users}
                columns={columns}
                columnHeaderHeight={50}
                rowHeight={40}
                disableRowSelectionOnClick
                slots={{
                  toolbar: QuickSearchToolbar,
                }}
                onRowClick={(row) => {
                  setOpenEditModal({ user: row.row, open: true });
                }}
                sx={DataGridStyles}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
