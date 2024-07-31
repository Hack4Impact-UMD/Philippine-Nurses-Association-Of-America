// ForgotPassword.js

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PNAA_Logo from "../../assets/PNAA_Logo.png";
import { sendResetEmail } from "../../backend/AuthFunctions.js";
import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    sendResetEmail(email)
      .then(() => {
        setSubmitted(true);
      })
      .catch((error) => {
        setError(
          "*Error sending password reset email. Please try again later."
        );
      });
  };

  return (
    <div>
      <p className={styles.orgName}>Philippine Nurses Association of America</p>
      <p className={styles.mantra}>
        <span style={{ color: "#0533F3" }}>Shine</span>
        <span style={{ color: "#AB2218" }}> PNAA </span>
        <span style={{ color: "#F4D44C" }}>Shine</span>
      </p>
      <div className={styles.container}>
        <h2 className={styles.forgetPassword}>Forgot Password</h2>

        <span
          className={
            submitted
              ? `${styles.emailInstructionsLong}`
              : `${styles.emailInstructions}`
          }
        >
          {submitted
            ? "Password reset email has been sent."
            : "Enter your email and we will send you a link to reset your password."}
        </span>
        {submitted ? (
          <></>
        ) : (
          <>
            <div className={styles.emailContainer}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email Address"
                className={styles.input}
              />
              <div className={styles.centerButton}>
                <button
                  onClick={handleResetPassword}
                  className={styles.submitButton}
                >
                  Submit
                </button>
              </div>
            </div>
            <p className={styles.errorMessage}>{error}</p>
          </>
        )}
        <div>
          <button
            onClick={() => navigate("/signin")}
            className={styles.backLogin}
          >
            <Link>&#x3c; Back to Login</Link>
          </button>
        </div>
      </div>
      <img src={PNAA_Logo} alt="PNAA Logo" className={styles.logo} />
    </div>
  );
};

export default ForgotPassword;
