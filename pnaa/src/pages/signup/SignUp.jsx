import React, { useState, useRef } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { auth } from '../../config/firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../config/firebase';
import emailjs from '@emailjs/browser';


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

 const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();
    const email = document.getElementById('email');
    var templateParams = {
      email: email
    }
    emailjs.sendForm('service_1jzrt4f', 'template_sqle5it', form.current, 'N4OOC1nqHElmtUH1k')
        .then((result) => {
            console.log(result.text);
            console.log("a notification has been sent to the admin for account creation!")
        }, (error) => {
            console.log(error.text);
            console.log("error sending message, try again!")
        });
    };
  return (
    <div>
      <h2>Sign Up</h2>
      <form ref={form} onSubmit={sendEmail}>
        <input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="user">Chapter</option>
          <option value="admin">National</option>
        </select>
        <button type='submit' onClick={signUp}>Sign Up</button>
      </form>

      {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error message */}
      <p>
        Already have an account? <Link to="/signin">Sign In</Link>
      </p>
    </div>
  );
};

export default SignUp;
