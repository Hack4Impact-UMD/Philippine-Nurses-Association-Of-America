import NavigationBar from "../../components/NavigationBar/NavigationBar";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  return (
    <div>
      <div className={styles.header}>
        <h1>Welcome To Chapter Dashboard</h1>
        <button onClick={() => {}} className={styles.signOutButton}>
          Sign Out
        </button>
      </div>
      <NavigationBar />
    </div>
  );
};

export default Dashboard;
