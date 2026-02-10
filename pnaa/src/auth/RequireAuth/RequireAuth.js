import { Navigate } from "react-router-dom";
import Loading from "../../components/LoadingScreen/Loading";
import { AuthProvider, useAuth } from "../AuthProvider";
import styles from "./RequireAuth.module.css";

const RequireAuth = ({ children }) => {
  const authContext = useAuth();
  const role = authContext.token?.claims?.role;
  const normalizedRole = typeof role === "string" ? role.toLowerCase() : "";
  if (authContext.loading) {
    return <Loading />;
  } else if (!authContext.user) {
    return (
      <Navigate to="/signin" state={{ redir: window.location.pathname }} />
    );
  } else if (
    normalizedRole != "user" &&
    normalizedRole != "admin"
  ) {
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

export default RequireAuth;
