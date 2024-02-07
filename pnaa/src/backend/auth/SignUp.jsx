import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase-config';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../config/firebase-config';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('user');
  const navigate = useNavigate();

  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Save additional user type information in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        userType: userType,
      });
      console.log("User created successfully with type:", userType);
      navigate(userType === 'admin' ? '/national-dashboard' : '/chapter-dashboard');
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  return (
    <div>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <select value={userType} onChange={(e) => setUserType(e.target.value)}>
        <option value="user">Chapter</option>
        <option value="admin">National</option>
      </select>
      <button onClick={signUp}>Sign Up</button>
    </div>
  );
};

export default SignUp;
