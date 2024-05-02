import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PNAA_Logo from "../../assets/PNAA_Logo.png";
import { authenticateUser } from "../../backend/AuthFunctions";
import styles from "./SignIn.module.css";

const SignIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    if (email && password) {
      authenticateUser(email, password)
        .then(() => {
          navigate("../dashboard");
        })
        .catch((error) => {
          const code = error.code;
          if (code === "auth/too-many-requests") {
            setError(
              "*Access to this account has been temporarily disabled due to many failed login attempts. You can reset your password or try again later."
            );
          } else {
            setError("*Incorrect email address or password");
          }
        });
    } else {
      setError("*Incorrect email address or password");
    }
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
        <h2 className={styles.login}>Login</h2>
        <div className={styles.form}>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email Address"
          />
          <p className={styles.forgot}>
            <Link to="/forgotpassword">Forgot Password?</Link>
          </p>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className={styles.input}
          />

          <label className={styles.showPass}>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              style={{ marginRight: "5px" }}
            />
            Show Password
          </label>
          <div className={styles.centerButton}>
            <button onClick={handleSignIn} className={styles.loginButton}>
              Login
            </button>
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
      </div>
      <img src={PNAA_Logo} alt="PNAA Logo" className={styles.logo} />
    </div>
  );
};

export default SignIn;
