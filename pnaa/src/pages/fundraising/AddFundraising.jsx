
import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import styles from "./AddFundraising.module.css";

import {
    getFirestore,
    doc,
    updateDoc,
    setDoc,
    collection,
  } from "firebase/firestore";

// import MemberDialogBox from "./MemberDialogBox";
import {db} from "../../config/firebase.ts";
import logo from "../../assets/PNAA_Logo.png"

// Material UI Components
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import PNAA_Logo from "../../assets/PNAA_Logo.png"; 
import { useUser} from '../../config/UserContext';




const AddFundraising = () => {
    const { currentUser, loading: userLoading } = useUser();

    
  
  

  // Collect screen width for responsive design
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  // Dialog box state
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState("");
  const [editedFund, setEditedFund] = useState(
   {
      Name: "",
      Date: "",
      Note: "",
      Amount: 0,
    }
  );
  // Menu anchor for mobile view
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Extract active status from member data for conditional rendering
  // const [memberActive, setMemberActive] = useState(member.active);

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
  const handleAddClick = async () => {

    if (window.confirm("Are you sure you want to add this new fundraising event?") == true) {


    try {
        const fundraiserCol = collection(db, "fundraisers");
        const newFundRef = doc(fundraiserCol);
        await setDoc(newFundRef,  {
            ...editedFund,
            ChapterName: currentUser.chapterId,
          });
        navigate(-1);
      } catch (error) {
        console.error("Error creating fundraiser: ", error);
      } 

    }
   
  };





  const handleRenewClick = () => {
    setDialogAction("renew");
    setDialogOpen(true);
  };

  // Handle menu click for mobile view
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleBackClick = () => {
    navigate(-1);
  }

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
      {createMaterialButton("#05208BB2", "Back to Main Fundraising", handleBackClick)}
      {createMaterialButton(
        "#00008B",
        "Add Fundraiser" ,
        handleAddClick,
       
      )}
      {createMaterialButton(
        "#91201A",
        "Archive",
        handleRenewClick,
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
          handleAddClick();
        }}
        style={{ color: "#05208BB2", fontFamily: "'Source Serif 4', serif" }}
      >
        Edit member
      </MenuItem>
     
     
    </Menu>
  );

  
  // Else, display normal screen
  return (
    <div className={styles["fundraiser-detail-container"]}>
      <div className={styles["fundraiser-detail-content"]}>
        <div className={styles["fundraiser-header-container"]}>
          <p className={styles["fundraiser-header"]}>Enter the fields to add a new fundraising event</p>
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

        <div className={styles["fundraiser-detail-information-container"]}>
          <div className={styles["fundraiser-detail-information-container-left"]}>
            <table className={styles["fundraiser-detail-table"]}>
              
              <tr>
                <td>
                  <p className={styles["fundraiser-label"]}>
                    Date
                  </p>
                </td>
                <td>
                 <input
                        type="text"
                        value={editedFund.Date}
                        onChange={(e) =>
                          setEditedFund({
                            ...editedFund,
                            Date: e.target.value,
                          })
                        }
                        className={styles["edit-input"]} // Add CSS for this
                      />
                </td>
              </tr>
              <tr>
                <td>
                  <p className={styles["fundraiser-label"]}>
                    Fundraising Name
                  </p>
                </td>
                <td>
                 <input
                        type="text"
                        value={editedFund.Name}
                        onChange={(e) =>
                          setEditedFund({
                            ...editedFund,
                            Name: e.target.value,
                          })
                        }
                        className={styles["edit-input"]} // Add CSS for this
                      />
                </td>
              </tr>
              <tr>
                <td>
                  <p className={styles["fundraiser-label"]}>
                    Type
                  </p>
                </td>
                <td>
                  <p className={styles["fundraiser-data"]}>
                    Event
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className={styles["fundraiser-label"]}>
                    Amount
                  </p>
                </td>
                <td>
                    <input
                        type="text"
                        value={editedFund.Amount}
                        onChange={(e) =>
                          setEditedFund({
                            ...editedFund,
                            Amount: e.target.value,
                          })
                        }
                        className={styles["edit-input"]} // Add CSS for this
                      />
                </td>
              </tr>
              <tr>
                <td>
                  <p className={styles["fundraiser-label"]}>
                    Note
                  </p>
                </td>
                <td>
                <input
                        type="text"
                        value={editedFund.Note}
                        onChange={(e) =>
                          setEditedFund({
                            ...editedFund,
                            Note: e.target.value,
                          })
                        }
                        className={styles["edit-input"]} // Add CSS for this
                      />
                </td>
              </tr>
            </table>
          </div>
          </div>
       
    </div>
    <img src={PNAA_Logo} alt="PNAA Logo" id={styles["logo"]}/>

    </div>
  )


    };

export default AddFundraising;