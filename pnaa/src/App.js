import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './backend/auth/SignUp';
import SignIn from './backend/auth/SignIn';
import NationalDash from './pages/dashboard/NationalDash';
import ChapterDash from './pages/dashboard/ChapterDash';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/national-dashboard" element={<NationalDash />} />
        <Route path="/chapter-dashboard" element={<ChapterDash />} />
        <Route path="/" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
