import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./MemberDetails.module.css";

import logo from "../../assets/PNAA_Logo.png"

// Material UI Components
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";

const MemberDetail = () => {
  // Pass in member data from previous state
  const location = useLocation();
  const { member } = location.state;

  console.log("whiskey", member);

  // Collect screen width for responsive design
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Dialog box state
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState("");

  // Menu anchor for mobile view
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Extract active status from member data for conditional rendering
  const [memberActive, setMemberActive] = useState(member.activeStatus);

  // Screen width breakpoints
  const mediumScreenWidth = 1000;
  const halfScreenWidth = 800;
  const mobileScreenWidth = 660;

  // Update screen width on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle action button clicks
  const handleEditClick = () => {};

  const handleSuspendClick = () => {
    setDialogAction("suspend");
    setDialogOpen(true);
  };

  const handleRenewClick = () => {
    setDialogAction("renew");
    setDialogOpen(true);
  };

  // Handle menu click for mobile view
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Modify button text for half screen width
  const buttonText = (text) => {
    if (screenWidth < mediumScreenWidth) {
      return text.split(" ")[0];
    }
    return text;
  };

  // Function for creating different Material UI action buttons
  const createMaterialButton = (color, text, onClick, disabled = false) => (
    <Button
      startIcon={<AddIcon />}
      style={{
        backgroundColor: disabled ? "#ccc" : color,
        color: disabled ? "#666" : "#fff",
        fontFamily: "'Source Serif 4', serif",
        fontSize: "14px",
        borderRadius: "6px",
        padding: "6px 12px",
        textTransform: "none",
        pointerEvents: disabled ? "none" : "auto",
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {buttonText(text)}
    </Button>
  );

  // Use active status to determine which buttons are available
  const actionButtons = () => (
    <div className={styles["action-button-group"]}>
      {createMaterialButton("#05208BB2", "Edit member")}
      {createMaterialButton(
        "#91201A",
        "Suspend member",
        handleSuspendClick,
        !memberActive
      )}
      {createMaterialButton(
        "#14804A",
        "Renew member",
        handleRenewClick,
        memberActive
      )}
    </div>
  );

  // Create Material UI menu items for mobile view, same functionality as action buttons
  // Use conditional rendering based on active statuss
  const actionMenuItems = () => (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
    >
      <MenuItem
        onClick={() => {
          handleClose();
          handleEditClick();
        }}
        style={{ color: "#05208BB2", fontFamily: "'Source Serif 4', serif" }}
      >
        Edit member
      </MenuItem>
      {memberActive && (
        <MenuItem
          onClick={() => {
            handleClose();
            handleSuspendClick();
          }}
          style={{ color: "#91201A", fontFamily: "'Source Serif 4', serif" }}
        >
          Suspend member
        </MenuItem>
      )}
      {!memberActive && (
        <MenuItem
          onClick={() => {
            handleClose();
            handleRenewClick();
          }}
          style={{ color: "#14804A", fontFamily: "'Source Serif 4', serif" }}
        >
          Renew member
        </MenuItem>
      )}
    </Menu>
  );

  // If no member data is available, display error message
  if (!member) {
    return <div> No member data available. </div>;
  }

  // Else, display normal screen
  return (
    <div className={styles["member-detail-container"]}>
      <div className={styles["member-detail-content"]}>
        <div className={styles["membership-header-container"]}>
          <p className={styles["membership-header"]}>MEMBERSHIP</p>
        </div>

        <div className={styles["member-detail-information-container"]}>
          <div className={styles["member-detail-information-container-left"]}>
            <table className={styles["member-detail-table"]}>
              <tr>
                <td>
                  <p className={styles["membership-label"]}>
                    MEMBERSHIP CARD
                  </p>
                </td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <div className={styles["membership-card"]}>
                    <div className={styles["membership-card-left"]}>
                      <img className={styles["PNAA_Logo"]} src={logo}/>
                      <p>Philippine Nurses Association of America</p>
                    </div>
                    <div className={styles["membership-card-right"]}>
                      <p className={`${styles['membership-data']} ${styles['name-font']}`}>
                        {member.name}
                      </p>
                      <div className={styles["membership-card-data"]}>
                      <p className={`${styles['membership-data']} ${styles['membership-card-font']}`}>
                        Chapter: {member.chapterName}
                      </p>
                      <p className={`${styles['membership-data']} ${styles['membership-card-font']}`}>
                        ID: {member.memberId}
                      </p>
                      {/* ... Example Fields ... */}
                    </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <p className={styles["membership-label"]}>
                    MEMBERSHIP STATUS
                  </p>
                </td>
                <td>
                  <p className={styles["membership-data"]}>{member.activeStatus}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className={styles["membership-label"]}>
                    RENEWAL DUE DATE
                  </p>
                </td>
                <td>
                  <p className={styles["membership-data"]}>
                   {member.renewalDueDate}
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className={styles["membership-label"]}>
                    Wild Apricot Member ID
                  </p>
                </td>
                <td>
                  <p className={styles["membership-data"]}>
                    {member.memberId}
                  </p>
                </td>
              </tr>
            </table>
          </div>
          <div className={styles["member-detail-information-container-right"]}>
            <table className={styles["member-detail-table"]}>
              <tr>
                <td>
                  <p className={`${styles['membership-label']} ${styles['underline']}`}>
                    MORE INFORMATION
                  </p>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <p className={`${styles['membership-label']} ${styles['small']}`}>
                    MEMBERSHIP LEVEL
                  </p>
                </td>
                <td>
                  <p className={styles["membership-data"]}>
                    {member.membershipLevel}
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className={`${styles['membership-label']} ${styles['small']}`}>
                    EMAIL
                  </p>
                </td>
                <td>
                  <p className={styles["membership-data"]}>
                    {member.email}
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className={`${styles['membership-label']} ${styles['small']}`}>
                    EDUCATION
                  </p>
                </td>
                <td>
                  <p className={styles["membership-data"]}>
                    {member.highestEducation}
                  </p>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;
