// ForgotPassword.js

import React, { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import styles from  "./ForgotPassword.module.css"
import PNAA_Logo from "../../assets/PNAA_Logo.png";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createUser } from '../../backend/authFunctions';
import { sendResetEmail } from "../../backend/authFunctions";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    // Implement logic to send reset password link
    // You can use Firebase's password reset functionality here
    // Example: auth.sendPasswordResetEmail(email);
    sendResetEmail(email);
    console.log("Reset password link sent to", email);
  };

  return (
    <div id={styles["background"]}>
      <p id={styles["orgname"]}>Philippine Nurses Association of America</p>
      <p id={styles["mantra"]}>
        <span style={{ color: "#0533F3" }}>Shine</span>
        <span style={{ color: "#AB2218" }}> PNAA </span>
        <span style={{ color: "#F4D44C" }}>Shine</span>
      </p>
      <div id={styles["container"]}>
        <h2 className={styles.forgotPasswordTitle}>
            <span className={styles.titleIcon}></span>
            Forgot Password
        </h2>
        <span className={styles.emailInstructions}>
            <span className={styles.lockIcon}></span> 
            Enter your email and we will send you a link to reset your password.
        </span>
        <div className={styles.lockIconContainer}>
            <LockOutlinedIcon className={styles.lockIconStyle} />
        </div>


        <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Member ID / Email Address"
            className={styles.emailInput} // Apply CSS class for styling
        />
        <button onClick={handleResetPassword} className={styles.submitButton}>Submit</button>
        <button onClick={() => navigate("/")} className={styles.backToLogin}>Back to login</button>

    </div>      
      <img src={PNAA_Logo} alt="PNAA Logo" id={styles["logo"]} />
    </div>
  );
  
};

export default ForgotPassword;
