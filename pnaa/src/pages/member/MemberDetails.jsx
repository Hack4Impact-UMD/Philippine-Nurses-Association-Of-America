import { useLocation } from "react-router-dom";
import styles from "./MemberDetails.module.css";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

const MemberDetail = () => {
  const location = useLocation();
  const { member } = location.state;

  // Function to create a button with shared styles and varying background color
  const createMaterialButton = (color, text) => (
    <Button
      startIcon={<AddIcon />}
      style={{
        backgroundColor: color,
        color: "#fff",
        fontFamily: "'Source Serif 4', serif",
        fontSize: "14px",
        borderRadius: "6px",
        padding: "6px 12px",
        textTransform: "none",
      }}
    >
      {text}
    </Button>
  );

  if (!member) {
    return <div>No member data available.</div>;
  }

  return (
    <div className={styles["member-detail-container"]}>
      <div className={styles["member-detail-content"]}>
        <div className={styles["membership-header-container"]}>
          <p className={styles["membership-header"]}>MEMBERSHIP</p>
          <div className={styles["action-button-group"]}>
            {createMaterialButton("#05208BB2", "Edit member")}
            {createMaterialButton("#91201A", "Suspend member")}
            {createMaterialButton("#14804A", "Renew member")}
          </div>
        </div>

        <div className={styles["member-detail-information-container"]}>
          <div className={styles["member-detail-information-container-left"]}>
          <table className={styles["member-detail-table"]}>
                <tr>
                    <td><p className={styles["membership-card-label-header"]}>MEMBERSHIP CARD</p></td>
                    <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td><div className={styles["membership-card"]}>
                    <p>
                      Name: {member.FirstName} {member.LastName}
                    </p>
                    <p>ID: {member.id}</p>
                    {/* ... Example Fields ... */}
                  </div></td>
                </tr>
                <tr>
                  <td><p className={styles["membership-card-label-header"]}>MEMBERSHIP STATUS</p></td>
                  <td><p className={styles["membership-card-label-data"]}>Active</p></td>
                </tr>
                <tr>
                  <td><p className={styles["membership-card-label-header"]}>REGISTRATION</p></td>
                  <td><p className={styles["membership-card-label-data"]}>01.01.0001</p></td>
                </tr>
                <tr>
                  <td><p className={styles["membership-card-label-header"]}>RENEWAL</p></td>
                  <td><p className={styles["membership-card-label-data"]}>01.01.0001</p></td>
                </tr>
                <tr>
                  <td><p className={styles["membership-card-label-header"]}>RENEWAL DUE</p></td>
                  <td><p className={styles["membership-card-label-data"]}>01.01.0001</p></td>
                </tr>
                <tr>
                  <td><p className={styles["membership-card-label-header"]}>LEVEL LAST UPDATED</p></td>
                  <td><p className={styles["membership-card-label-data"]}>01.01.0001</p></td>
                </tr>
            </table>
        
          </div>  
          <div className={styles["member-detail-information-container-right"]}>
            <h1>UGHHHH</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;
