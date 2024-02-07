import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const auth = getAuth();

export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider) // Return the promise
    .then((result) => {
      // Handle sign-in response here
      console.log("Google sign in successful", result.user);
      return result.user; // Resolve the user info
    })
    .catch((error) => {
      console.error("Error signing in with Google", error);
      throw error; // Propagate the error
    });
};
