import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../../config/UserContext";
import { auth } from "../../config/firebase";

import styles from "./ChapterDashboard.module.css";

const ChapterDashboard = () => {
  const { currentUser, loading } = useUser(); //Fetchces data on currentUser
  console.log("current user", currentUser);
  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    navigate("/signin");
    return null;
  }

  const signOut = () => {
    auth.signOut();
    navigate("/");
  };

  return (
    <div>
      <div className={styles.header}>
        {currentUser.name ? (
          <h1>Welcome To Chapter Dashboard{", " + currentUser.name}!</h1>
        ) : (
          <h1>Welcome To Chapter Dashboard!</h1>
        )}
        <button onClick={signOut} className={styles.signOutButton}>
          Sign Out
        </button>
      </div>
      <div className={styles.navTabs}>
        <ul>
          <li className={styles.tabItem}>
            <NavLink
              to=""
              className={({ isActive }) =>
                isActive ? styles.activeTabLink : styles.tabLink
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li className={styles.tabItem}>
            <NavLink
              to="chapter-details-nat"
              className={({ isActive }) =>
                isActive ? styles.activeTabLink : styles.tabLink
              }
            >
              Chapter Details
            </NavLink>
          </li>
          <li className={styles.tabItem}>
            <NavLink
              to="events"
              className={({ isActive }) =>
                isActive ? styles.activeTabLink : styles.tabLink
              }
            >
              Events
            </NavLink>
          </li>

          <li className={styles.tabItem}>
            <NavLink
              to="fundraising"
              className={({ isActive }) =>
                isActive ? styles.activeTabLink : styles.tabLink
              }
            >
              Fundraising
            </NavLink>
          </li>
        </ul>
      </div>
      <div className={styles.tabContent}>
        <Outlet />
      </div>
    </div>
  );
};

export default ChapterDashboard;
