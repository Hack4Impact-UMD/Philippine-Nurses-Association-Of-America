import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({ uid: null, chapterData: null, chapterId: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        // We don't await here because we want to return unsubscribe right away.
        fetchUserData(user.uid);
      } else {
        // User is signed out.
        setCurrentUser({ uid: null, chapterData: null, chapterId: null });
        setLoading(false);
      }
    });

    const fetchUserData = async (uid) => {
      try {
        const db = getFirestore();
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          let chapterData = null;
          let chapterId = userData.chapterId || null;

          if (chapterId) {
            const chapterRef = doc(db, "chapters", chapterId);
            const chapterSnap = await getDoc(chapterRef);
            chapterData = chapterSnap.exists() ? chapterSnap.data() : null;
          }

          setCurrentUser({ uid, chapterData, chapterId });
        } else {
          console.error("No user data found in Firestore for uid:", uid);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    return unsubscribe; // Unsubscribe from auth on unmount.
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, loading }}>
      {!loading && children}
    </UserContext.Provider>
  );
};
