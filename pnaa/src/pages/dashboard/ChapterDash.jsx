import React from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { useUser } from '../../config/UserContext';

import styles from './ChapterDashboard.module.css';

const ChapterDashboard = () => {
  const { currentUser, loading } = useUser(); //Fetchces data on currentUser
  console.log("current user", currentUser);
  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    navigate('/signin');
    return null;                                            
  }

  const signOut = () => {
    auth.signOut();
    navigate('/');
  };

  return (
    <div>
      <h1>Welcome To Chapter Dashboard</h1>
      <button onClick={signOut}>Sign Out</button>
      <div className={styles.navTabs}>
        <ul>
          <li className={styles.tabItem}>
            <NavLink
              to="about"
              className={({ isActive }) => isActive ? styles.activeTabLink : styles.tabLink}>
              About
            </NavLink>
          </li>
          <li className={styles.tabItem}>
            <NavLink
              to="members"
              className={({ isActive }) => isActive ? styles.activeTabLink : styles.tabLink}>
              Member Management
            </NavLink>
          </li>
          <li className={styles.tabItem}>
            <NavLink
              to="events"
              className={({ isActive }) => isActive ? styles.activeTabLink : styles.tabLink}>
              Education / Event
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
