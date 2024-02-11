import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase-config';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../config/firebase-config';
import emailjs from '@emailjs/browser';


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
    <form ref={form} onSubmit={sendEmail}>
      <input id = "email" name = "email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input id = "password" name = "password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <select value={userType} onChange={(e) => setUserType(e.target.value)}>
        <option value="user">Chapter</option>
        <option value="admin">National</option>
      </select>
      <button type='submit' onClick={signUp}>Sign Up</button>
    </form>
  );
};

export default SignUp;
