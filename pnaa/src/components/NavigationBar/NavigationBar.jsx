import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import styles from "./NavigationBar.module.css";

const NavigationBar = () => {
  const auth = useAuth();
  return (
    <div className={styles.navTabs}>
      <ul>
        <li className={styles.tabItem}>
          <NavLink
            to="../dashboard"
            className={({ isActive }) =>
              isActive
                ? `${styles.activeTabLink} ${styles.firstTabLink}`
                : `${styles.tabLink} ${styles.firstTabLink}`
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li className={styles.tabItem}>
          <NavLink
            to="../details"
            className={({ isActive }) =>
              isActive ? styles.activeTabLink : styles.tabLink
            }
          >
            Chapter Details
          </NavLink>
        </li>
        <li className={styles.tabItem}>
          <NavLink
            to="../events"
            className={({ isActive }) =>
              isActive ? styles.activeTabLink : styles.tabLink
            }
          >
            Events
          </NavLink>
        </li>

        <li className={styles.tabItem}>
          <NavLink
            to="../fundraising"
            className={({ isActive }) =>
              isActive ? styles.activeTabLink : styles.tabLink
            }
          >
            Fundraising
          </NavLink>
        </li>
        {auth.token?.claims?.role?.toLowerCase() === "admin" && (
          <li className={styles.tabItem}>
            <NavLink
              to="../users"
              className={({ isActive }) =>
                isActive ? styles.activeTabLink : styles.tabLink
              }
            >
              Users
            </NavLink>
          </li>
        )}
        <li className={styles.tabItem}>
          <NavLink
            to="../settings"
            className={({ isActive }) =>
              isActive
                ? `${styles.activeTabLink} ${styles.lastTabLink}`
                : `${styles.tabLink} ${styles.lastTabLink}`
            }
          >
            Settings
          </NavLink>
        </li>
      </ul>
    </div>
  );
};
export default NavigationBar;
