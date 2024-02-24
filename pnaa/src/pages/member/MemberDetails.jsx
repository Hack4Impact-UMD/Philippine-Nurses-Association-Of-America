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
          <table className={styles["membership-card-detail-table"]}>
            <tr>
              <td><p className={styles["membership-label"]}>MEMBERSHIP CARD</p></td>
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
              <td><p className={styles["membership-label"]}>MEMBERSHIP STATUS</p></td>
              <td><p className={styles["membership-card-label-data"]}>Active</p></td>
            </tr>
            <tr>
              <td><p className={styles["membership-label"]}>REGISTRATION</p></td>
              <td><p className={styles["membership-card-label-data"]}>01.01.0001</p></td>
            </tr>
            <tr>
              <td><p className={styles["membership-label"]}>RENEWAL</p></td>
              <td><p className={styles["membership-card-label-data"]}>01.01.0001</p></td>
            </tr>
            <tr>
              <td><p className={styles["membership-label"]}>RENEWAL DUE</p></td>
              <td><p className={styles["membership-card-label-data"]}>01.01.0001</p></td>
            </tr>
            <tr>
              <td><p className={styles["membership-label"]}>LEVEL LAST UPDATED</p></td>
              <td><p className={styles["membership-card-label-data"]}>01.01.0001</p></td>
            </tr>
          </table>
        
          </div>  
          <div className={styles["member-detail-information-container-right"]}>
            <table className={styles["member-detail-table"]}>
              <tr>
                <td><p className={`${styles['membership-label']} ${styles['small']}`}>GENDER</p></td>
                <td>UHHHH {member.gender}</td>
              </tr>
              <tr>
                <td><p className={`${styles['membership-label']} ${styles['small']}`}>AGE</p></td>
                <td>{member.gender}</td>
              </tr>
              <tr>
                <td><p className={`${styles['membership-label']} ${styles['small']}`}>DONATED/SERVED HOURS</p></td>
                <td>{member.gender}</td>
              </tr>
              <tr>
                <td><p className={`${styles['membership-label']} ${styles['underline']}`}>NURSING EDUCATION</p></td>
                <td>{member.gender}</td>
              </tr>
              <tr>
                <td><p className={`${styles['membership-label']} ${styles['small']}`}>SCHOOL NAME</p></td>
                <td>{member.gender}</td>
              </tr>
              <tr>
                <td><p className={`${styles['membership-label']} ${styles['small']}`}>YEAR GRADUATED</p></td>
                <td>{member.gender}</td>
              </tr>
              <tr>
                <td><p className={`${styles['membership-label']} ${styles['small']}`}>COUNTRY</p></td>
                <td>{member.gender}</td>
              </tr>
              <tr>
                <td><p className={`${styles['membership-label']} ${styles['small']}`}>DEGREE RECEIVED</p></td>
                <td>{member.gender}</td>
              </tr>
              <tr>
                <td><p className={`${styles['membership-label']} ${styles['small']}`}>HIGHEST LEVEL OF EDUCATION</p></td>
                <td>{member.gender}</td>
              </tr>
              <tr>
                <td><p className={`${styles['membership-label']} ${styles['underline']}`}>WORK INFORMATION</p></td>
                <td>{member.gender}</td>
              </tr>
              <tr>
                <td><p className={`${styles['membership-label']} ${styles['small']}`}>STATUS</p></td>
                <td>{member.gender}</td>
              </tr>
              <tr>
                <td><p className={`${styles['membership-label']} ${styles['small']}`}>EMPLOYER</p></td>
                <td>{member.gender}</td>
              </tr>
              <tr>
                <td><p className={`${styles['membership-label']} ${styles['small']}`}>TYPE OF INSTITUTION</p></td>
                <td>{member.gender}</td>
              </tr>
              <tr>
                <td><p className={`${styles['membership-label']} ${styles['small']}`}>PRIMARY NURSING PRACTICE</p></td>
                <td>{member.gender}</td>
              </tr>
              <tr>
                <td><p className={`${styles['membership-label']} ${styles['small']}`}>ADVANCED PRACTICE NURSES</p></td>
                <td>{member.gender}</td>
              </tr>
              <tr>
                <td><p className={`${styles['membership-label']} ${styles['small']}`}>YEAR OF NURSING EXPERIENCES</p></td>
                <td>{member.gender}</td>
              </tr>
              <tr>
                <td><p className={`${styles['membership-label']} ${styles['small']}`}>NATIONAL CERTIFICATION</p></td>
                <td>{member.gender}</td>
              </tr>
              <tr>
                <td><p className={`${styles['membership-label']} ${styles['small']}`}>YEARS AS PNAA CHAPTER MEMBER</p></td>
                <td>{member.gender}</td>
              </tr>
              <tr>
                <td><p className={`${styles['membership-label']} ${styles['underline']}`}>NOTES</p></td>
                <td></td>
              </tr>
            </table>
            <p className={styles["member-notes"]}>{member.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;
