import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { signInWithGoogle } from "./AuthService";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import "./SignIn.css"

const SignIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
      <div id="container">
      <h2 id="login">Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Member ID / Email Address"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleSignIn}>Login</button>
      {/* <button onClick={handleGoogleSignIn}>Sign in with Google</button> */}
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      <p id="dont">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
      </div>
    </div>
  );
};

export default SignIn;
