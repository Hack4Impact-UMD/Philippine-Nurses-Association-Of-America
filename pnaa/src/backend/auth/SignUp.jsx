import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../config/firebase-config';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../config/firebase-config';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const signUp = async () => {
    try {
      setError('');

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Save additional user type information in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        userType: userType,
      });
      // console.log("User created successfully with type:", userType);
      navigate(userType === 'admin' ? '/national-dashboard' : '/chapter-dashboard');
    } catch (error) {
      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/invalid-email':
          setError('The email address is not valid.');
          break;
        case 'auth/email-already-in-use':
          setError('This email is already in use by another account.');
          break;
        case 'auth/weak-password':
          setError('The password is too weak. It must be at least 6 characters.');
          break;
        default:
          setError('Failed to sign up. Please try again later.');
          break;
      }
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <select value={userType} onChange={(e) => setUserType(e.target.value)}>
        <option value="user">Chapter</option>
        <option value="admin">National</option>
      </select>
      <button onClick={signUp}>Sign Up</button>
      {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error message */}
      <p>
        Already have an account? <Link to="/signin">Sign In</Link>
      </p>
    </div>

  );
};

export default SignUp;
