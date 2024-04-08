import React, { useState, useRef } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { auth } from '../../config/firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../config/firebase';
import emailjs from '@emailjs/browser';
import { createUser } from '../../backend/authFunctions';


const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const signUp = async () => {
    createUser(email, userType);
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
      <h2>Create an account for a user or admin</h2>
      <form ref={form} onSubmit={sendEmail}>
        <input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="user">Chapter</option>
          <option value="admin">National</option>
        </select>
        <button type='submit' onClick={signUp}>Send password reset email</button>
      </form>

      {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error message */}
      <p>
        Already have an account? <Link to="/signin">Sign In</Link>
      </p>
    </div>
  );
};

export default SignUp;
