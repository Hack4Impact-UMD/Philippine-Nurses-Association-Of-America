import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './SignUp.module.css';
import PNAA_Logo from "../../assets/PNAA_Logo.png";

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [region, setRegion] = useState('');
  const [accountType, setAccountType] = useState('user');

  const handleSignUp = () => {
    // Your sign-up logic here
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
        <h2>Sign Up</h2>
        <div className={styles.form}>
          <div className={styles.nameFields}>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" />
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" />
          </div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
          <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" />
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">Select Region</option>
            {/* Add your region options here */}
          </select>
          <select value={accountType} onChange={(e) => setAccountType(e.target.value)} placeholder="Account Type" >
            <option value="user">Chapter</option>
            <option value="admin">National</option>
          </select>
          <button onClick={handleSignUp}>Create Account</button>
        </div>
        <p className={styles.backToLogin}>
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
      <img src={PNAA_Logo} alt="PNAA Logo" id={styles["logo"]} />
    </div>
  );
};

export default SignUp;