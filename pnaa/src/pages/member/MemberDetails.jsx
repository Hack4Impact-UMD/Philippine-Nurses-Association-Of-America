import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./MemberDetails.module.css";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";

const MemberDetail = () => {
  const location = useLocation();
  const { member } = location.state;
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const mediumScreenWidth = 1000;
  const halfScreenWidth = 800;
  const mobileScreenWidth = 660;

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const buttonText = (text) => {
    if (screenWidth < mediumScreenWidth) {
      return text.split(" ")[0];
    }
    return text;
  };

  const createMaterialButton = (color, text) => (
    <Button
      startIcon={<AddIcon />}
      style={{
        backgroundColor: color,
        color: "#fff",
        fontFamily: "'Source Serif 4', serif",
        fontSize: "14px",
        borderRadius: "6px",
        padding: "6px 12px",
        textTransform: "none",
      }}
    >
      {buttonText(text)}
    </Button>
  );

  const actionButtons = () => (
    <div className={styles["action-button-group"]}>
      {createMaterialButton("#05208BB2", "Edit member")}
      {createMaterialButton("#91201A", "Suspend member")}
      {createMaterialButton("#14804A", "Renew member")}
    </div>
  );

  const actionMenuItems = () => (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
    >
      <MenuItem onClick={handleClose} style={{ color: "#05208BB2" }}>
        Edit member
      </MenuItem>
      <MenuItem onClick={handleClose} style={{ color: "#91201A" }}>
        Suspend member
      </MenuItem>
      <MenuItem onClick={handleClose} style={{ color: "#14804A" }}>
        Renew member
      </MenuItem>
    </Menu>
  );

  if (!member) {
    return <div>No member data available.</div>;
  }

  return (
    <div className={styles["member-detail-container"]}>
      <div className={styles["member-detail-content"]}>
        <div className={styles["membership-header-container"]}>
          <p className={styles["membership-header"]}>MEMBERSHIP</p>
          {screenWidth < mobileScreenWidth ? (
            <>
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MenuIcon />
              </IconButton>
              {actionMenuItems()}
            </>
          ) : (
            actionButtons()
          )}
        </div>

        <div className={styles["member-detail-information-container"]}>
          <div className={styles["member-detail-information-container-left"]}>
            <table className={styles["member-detail-table"]}>
              <tr>
                <td>
                  <p className={styles["membership-card-label-header"]}>
                    MEMBERSHIP CARD
                  </p>
                </td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <div className={styles["membership-card"]}>
                    <p>
                      Name: {member.FirstName} {member.LastName}
                    </p>
                    <p>ID: {member.id}</p>
                    {/* ... Example Fields ... */}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <p className={styles["membership-card-label-header"]}>
                    MEMBERSHIP STATUS
                  </p>
                </td>
                <td>
                  <p className={styles["membership-card-label-data"]}>Active</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className={styles["membership-card-label-header"]}>
                    REGISTRATION
                  </p>
                </td>
                <td>
                  <p className={styles["membership-card-label-data"]}>
                    01.01.0001
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className={styles["membership-card-label-header"]}>
                    RENEWAL
                  </p>
                </td>
                <td>
                  <p className={styles["membership-card-label-data"]}>
                    01.01.0001
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className={styles["membership-card-label-header"]}>
                    RENEWAL DUE
                  </p>
                </td>
                <td>
                  <p className={styles["membership-card-label-data"]}>
                    01.01.0001
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className={styles["membership-card-label-header"]}>
                    LEVEL LAST UPDATED
                  </p>
                </td>
                <td>
                  <p className={styles["membership-card-label-data"]}>
                    01.01.0001
                  </p>
                </td>
              </tr>
            </table>
          </div>
          <div className={styles["member-detail-information-container-right"]}>
            <h1>UGHHHH</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;
