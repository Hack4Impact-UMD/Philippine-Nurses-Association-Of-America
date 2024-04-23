import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import styles from "./SignIn.module.css"
import PNAA_Logo from "../../assets/PNAA_Logo.png";

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
    <div id={styles["background"]}>
      <p id={styles["orgname"]}>Philippine Nurses Association of America</p>
      <p id={styles["mantra"]}>
        <span style={{ color: "#0533F3" }}>Shine</span>
        <span style={{ color: "#AB2218" }}> PNAA </span>
        <span style={{ color: "#F4D44C" }}>Shine</span>
      </p>
      <div id={styles["container"]}>
        <h2 id="login">Login</h2>
        <div className={styles.form}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Member ID / Email Address"
          />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <label>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Show Password
          </label>
          <button onClick={handleSignIn}>Login</button>
          {error && <p id={styles["error"]} style={{ color: "red" }}>{error}</p>}{" "}
        </div>
        <p className={styles.backToLogin}>
          Dont Remember Your Password? <Link to="/forgotpassword">Forgot Password</Link>
        </p>
      </div>
      <img src={PNAA_Logo} alt="PNAA Logo" id={styles["logo"]} />
    </div>
  );
};

export default SignIn;
