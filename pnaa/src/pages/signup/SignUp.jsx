import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import styles from './SignUp.module.css';
import PNAA_Logo from "../../assets/PNAA_Logo.png";
import { createUser } from '../../backend/authFunctions';
import { useState, useEffect } from 'react';


const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [chapterName, setChapterName] = useState('');
  const [accountType, setAccountType] = useState('user');
  const [chapters, setChapters] = useState([]);
  const [userChapter, setUserChapter] = useState(true);
  const navigate = useNavigate(); 
  let err = false;




  useEffect(() => {
    const fetchChapters = async () => {
      const db = getFirestore();
      const chaptersRef = collection(db, 'chapters');
      try {
        const snapshot = await getDocs(chaptersRef);
        const chapterNames = snapshot.docs.map(doc => doc.data().name);
        setChapters(chapterNames);
      } catch (error) {
        console.error("Error fetching chapters: ", error);
      }
    }
    fetchChapters();
  }, []);

  const handleSignUp = () => {

    if(chapterName !== ''){
    // lastName is necessary, phone Number is not necessary
    createUser(email, accountType, firstName, chapterName, lastName).catch((error) => {
    window.alert("An account has already been created with that email!");
    err = true;
  }).then(() => {
    if(!err){
      navigate('/');
      window.alert("An account has successfully been created! You may now sign in after resetting your password");
      
    }
    err = false;

  })
}else{
  // lastName is necessary, phone Number is not necessary
  createUser(email, accountType, firstName, 'National', lastName).catch((error) => {
    window.alert("An account has already been created with that email!");
    err = true;
  }).then(() => {
    if(!err){
      navigate('/');
      window.alert("An account has successfully been created! You may now sign in after resetting your password");
      
    }
    err = false;

  })


}

      
  };




  const handleChangeType = (userType) => {
    setUserChapter(!userChapter);
    setAccountType(userType);

  }
  return (
    <div id={styles["background"]}>
      <p id={styles["orgname"]}>Philippine Nurses Association of America</p>
      <p id={styles["mantra"]}>
        <span style={{ color: "#0533F3" }}>Shine</span>
        <span style={{ color: "#AB2218" }}> PNAA </span>
        <span style={{ color: "#F4D44C" }}>Shine</span>
      </p>
      <div id={styles["container"]}>
        <h2>Sign Up</h2>
        <div className={styles.form}>
          <div className={styles.nameFields}>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" />
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" />
          </div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
          
          <select value={accountType} onChange={(e) => handleChangeType(e.target.value)} placeholder="Account Type" >
            <option value="user">Chapter</option>
            <option value="admin">National</option>
          </select>

          {userChapter && <h5>Select your chapter:</h5>}
          {userChapter && <select value={chapterName} onChange={(e) => setChapterName(e.target.value)} >
          {chapters.map((chapter, index) => (
                
                <option key={index} value={chapter}>{chapter}</option>
              ))}
           
          </select>}
          
          <button onClick={handleSignUp}>Create Account</button>
        </div>
       
      </div>
      <img src={PNAA_Logo} alt="PNAA Logo" id={styles["logo"]} />
    </div>
  );
};

export default SignUp;
