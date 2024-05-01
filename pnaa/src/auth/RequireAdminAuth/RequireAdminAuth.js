import { Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../AuthProvider";
import styles from "./RequireAdminAuth.module.css";

const RequireAdminAuth = ({ children }) => {
  const authContext = useAuth();
  if (authContext.loading) {
    return (
      /*  Placeholder for some loading component */
      <div className={styles.loadingContainer}>
        <h1>Hello world!</h1>
      </div>
    );
  } else if (!authContext.user) {
    return (
      <Navigate to="/signin" state={{ redir: window.location.pathname }} />
    );
  } else if (authContext.token?.claims?.role.toLowerCase() != "admin") {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.errorMessage}>
          You do not have permission to access this page.
        </p>
      </div>
    );
  }

  return <AuthProvider>{children}</AuthProvider>;
};

export default RequireAdminAuth;
