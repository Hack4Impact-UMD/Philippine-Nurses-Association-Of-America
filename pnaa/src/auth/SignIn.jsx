import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { signInWithGoogle } from "./AuthService";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import "./SignIn.css"
import PNAA_Logo from "../pages/member/PNAA_Logo.png"; 

const SignIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const userType = await getUserType(user.uid); // Fetch user type
        setError("");
        // console.log("Sign in successful:", user, "User Type:", userType);
        navigate(
          userType === "admin" ? "/national-dashboard" : "/chapter-dashboard"
        );
      })
      .catch((error) => {
        setError("Failed to sign in. Please check your credentials.");
        console.error("Error signing in:", error);
      });
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then(async (user) => {
        const userType = await getUserType(user.uid); // Fetch user type
        setError("");
        // console.log("User signed in with Google:", user, "User Type:", userType);
        navigate(
          userType === "admin" ? "/national-dashboard" : "/chapter-dashboard"
        );
      })
      .catch((error) => {
        setError("Failed to sign in with Google. Please try again.");
        console.error("Error signing in with Google:", error.message);
      });
  };

  const getUserType = async (uid) => {
    const db = getFirestore();
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data().userType; // returns 'admin', 'user', etc.
    } else {
      console.error("Error with getting user type");
    }
  };

  return (
    <div id="background">
      <p id="orgname">Philippine Nurses Association of America</p>
      <p id="mantra"><span style={{color:'#0533F3'}}>Shine</span><span style={{color:'#AB2218'}}> PNAA </span><span style={{color:'#F4D44C'}}>Shine</span></p>
      <div id="container">
      <h2 id="login">Login</h2>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Member ID / Email Address"
      />
      <p id="forgot">Forgot Password?</p>
      <input
        id="password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <label id="passwordLabel" htmlFor="showPassword">
          <input
            id="showPassword"
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Show Password
      </label>
      <button id="loginbutton" onClick={handleSignIn}>Login</button>
      {/* <button onClick={handleGoogleSignIn}>Sign in with Google</button> */}
      {error && <p id="error" style={{ color: "red" }}>{error}</p>}{" "}
      <p id="dont">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
      </div>
      <img src={PNAA_Logo} alt="PNAA Logo" id="logo"/>
    </div>
  );
};

export default SignIn;
