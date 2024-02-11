import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, fetch additional user details
        const db = getFirestore();
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setCurrentUser(user);
        }
      } else {
        // User is signed out
        setCurrentUser(null);
      }
    });

    return unsubscribe; // Cleanup subscription
  }, []);

  return (
    <UserContext.Provider value={{ currentUser }}>
      {children}
    </UserContext.Provider>
  );
};
