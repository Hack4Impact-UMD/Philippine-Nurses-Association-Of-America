import { getAuth, onIdTokenChanged } from "@firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import app from "../config/firebase";

// The AuthContext that other components may subscribe to.
const AuthContext = createContext(null);

// Updates the AuthContext and re-renders children when the user changes.
// See onIdTokenChanged for what events trigger a change.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  // The loading state is used by RequireAuth/RequireAdminAuth
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    onIdTokenChanged(auth, (newUser) => {
      setUser(newUser);
      if (newUser != null) {
        newUser
          .getIdTokenResult()
          .then((newToken) => {
            setToken(newToken);
          })
          .catch(() => {});
      }
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
