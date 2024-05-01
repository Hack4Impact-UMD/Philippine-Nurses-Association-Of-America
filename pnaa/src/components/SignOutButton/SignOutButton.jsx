import { logOut } from "../../backend/AuthFunctions";
import styles from "./SignOutButton.module.css";
const SignOutButton = () => {
  return (
    <button onClick={logOut} className={styles.signOutButton}>
      Sign Out
    </button>
  );
};
export default SignOutButton;
