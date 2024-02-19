import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './config/UserContext';
import SignUp from './auth/SignUp';
import SignIn from './auth/SignIn';
import NationalDash from './pages/dashboard/NationalDash';
import ChapterDash from './pages/dashboard/ChapterDash';

function App() {
  return (
    <UserProvider> {/* Wrap the Router with UserProvider */}
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/national-dashboard" element={<NationalDash />} />
          <Route path="/chapter-dashboard" element={<ChapterDash />} />
          <Route path="/" element={<SignIn />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
