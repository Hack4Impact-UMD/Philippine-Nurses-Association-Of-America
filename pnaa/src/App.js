import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./config/UserContext";
import SignUp from "./pages/signup/SignUp";
import SignIn from "./pages/signin/SignIn";
import NationalDash from "./pages/dashboard/NationalDash";
import ChapterDash from "./pages/dashboard/ChapterDash";
import About from "./pages/about/About";
import MemberManagement from "./pages/member/MemberManagement";
import MemberDetail from "./pages/member/MemberDetails";
import Events from "./pages/events/Events";
import Fundraising from "./pages/fundraising/Fundraising";
import EventDetail from "./pages/events/EventDetails";

function App() {
  return (
    <UserProvider>
      {" "}
      {/* Wrap the Router with UserProvider */}
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/national-dashboard" element={<NationalDash />} />
          <Route path="/national-dashboard/signup" element={<SignUp />} />
          <Route path="/chapter-dashboard/*" element={<ChapterDash />}>
            <Route path="about" element={<About />} />
            <Route path="members" element={<MemberManagement />} />
            <Route path="member-detail" element={<MemberDetail />} />
            <Route path="events" element={<Events />} />
            <Route path="event-details" element={<EventDetail />} />
            <Route path="fundraising" element={<Fundraising />} />
          </Route>
          <Route path="/" element={<SignIn />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
