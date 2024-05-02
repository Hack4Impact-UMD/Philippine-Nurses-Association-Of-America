import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../../config/UserContext";
import { auth } from "../../config/firebase";

import styles from "./NationalDash.module.css";

const Home = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  const signOut = () => {
    auth.signOut();
    console.log("Signed out");
    navigate("/");
  };

  const signin = () => {
    navigate("/signup");
  };

  return (
    <div>
      <div className={styles.header}>
        {currentUser.name ? (
          <h1>Welcome To National Dashboard{", " + currentUser.name}!</h1>
        ) : (
          <h1>Welcome To National Dashboard!</h1>
        )}

        <div>
          <button onClick={signOut} className={styles.signOutButton}>
            Sign Out
          </button>
          <button onClick={signin} className={styles.makeAccountButton}>
            Make an account for another user
          </button>
        </div>
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

export default Home;
