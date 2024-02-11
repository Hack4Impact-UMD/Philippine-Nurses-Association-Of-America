import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase-config";
import { signInWithGoogle } from "./AuthService";
import { doc, getDoc, getFirestore } from "firebase/firestore";

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
    <div>
      <h2>Sign In</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleSignIn}>Sign In</button>
      {/* <button onClick={handleGoogleSignIn}>Sign in with Google</button> */}
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default SignIn;
