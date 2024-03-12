import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./EventDetails.module.css";

// Material UI Components
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";

const EventDetail = () => {
  // Else, display normal screen
  return (
    <div><p> hello world </p>
          <div className={styles["member-detail-information-container-right"]}>
            <table className={styles["member-detail-table"]}>
              <tr>
                <td>
                  <p className={`${styles['membership-label']} ${styles['small']}`}>
                    GENDER
                  </p>
                </td>
                <td>
                  <p className={styles["membership-data"]}>
                    placeholder {}
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className={`${styles['membership-label']} ${styles['small']}`}>
                    AGE
                  </p>
                </td>
                <td>
                  <p className={styles["membership-data"]}>
                    placeholder {}
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className={`${styles['membership-label']} ${styles['small']}`}>
                    DONATED/SERVED HOURS
                  </p>
                </td>
                <td>
                  <p className={styles["membership-data"]}>
                    placeholder {}
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className={`${styles['membership-label']} ${styles['underline']}`}>
                    NURSING EDUCATION
                  </p>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <p className={`${styles['membership-label']} ${styles['small']}`}>
                    SCHOOL NAME
                  </p>
                </td>
                <td>
                  <p className={styles["membership-data"]}>
                    placeholder {`event`.gender}
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className={`${styles['membership-label']} ${styles['small']}`}>
                    YEAR GRADUATED
                  </p>
                </td>
                <td>
                  <p className={styles["membership-data"]}>
                    placeholder {`event`.gender}
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className={`${styles['membership-label']} ${styles['small']}`}>
                    COUNTRY
                  </p>
                </td>
                <td>
                  <p className={styles["membership-data"]}>
                    placeholder {}
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className={`${styles['membership-label']} ${styles['small']}`}>
                    DEGREE RECEIVED
                  </p>
                </td>
                <td>
                  <p className={styles["membership-data"]}>
                    placeholder {}
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className={`${styles['membership-label']} ${styles['small']}`}>
                    HIGHEST LEVEL OF EDUCATION
                  </p>
                </td>
                <td>
                  <p className={styles["membership-data"]}>
                    placeholder {}
                  </p>
                </td>
              </tr>
            </table>
    </div>
    </div>
  )
};

export default EventDetail;
