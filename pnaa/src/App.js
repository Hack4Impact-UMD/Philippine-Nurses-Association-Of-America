import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./config/UserContext";
import SignUp from "./pages/signup/SignUp";
import SignIn from "./pages/signin/SignIn";
import ForgotPassword from "./pages/forgotpassword/ForgotPassword";
import NationalDash from "./pages/dashboard/NationalDash";
import ChapterDash from "./pages/dashboard/ChapterDash";
import About from "./pages/about/About";
import MemberManagement from "./pages/member/MemberManagement";
import MemberDetail from "./pages/member/MemberDetails";
import Events from "./pages/events/Events";
import Fundraising from "./pages/fundraising/Fundraising";
import EventDetail from "./pages/events/EventDetails";
import FundraisingDetail from "./pages/fundraising/FundraisingDetails";
import AddFundraising from "./pages/fundraising/AddFundraising";
import ChapterDetails from "./pages/chapter-details/ChapterDetails";
import ChapterDetailsNational from "./pages/chapter-details/ChapterDetailsNational";

function App() {
  return (
    <UserProvider>
    {" "}
    {/* Wrap the Router with UserProvider */}
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
  
        <Route path="/national-dashboard/*" element={<NationalDash />} >
            <Route path="about" element={<About />} />
          <Route path="members" element={<MemberManagement />} />
          <Route path="member-detail" element={<MemberDetail />} />
          <Route path="events" element={<Events />} />
          <Route path="event-details" element={<EventDetail />} />
          <Route path="fundraising" element={<Fundraising />} />
          <Route path="fundraising-detail" element={<FundraisingDetail />} />
          <Route path="add-fundraising" element={<AddFundraising/>} />
          <Route path="chapter-details-nat" element={<ChapterDetailsNational />} />
          <Route path="chapter-details" element={<ChapterDetails />} />
          <Route path="signup" element={<SignUp />} />

        </Route>


        <Route path="/chapter-dashboard/*" element={<ChapterDash />}>
          <Route path="about" element={<About />} />
          <Route path="members" element={<MemberManagement />} />
          <Route path="member-detail" element={<MemberDetail />} />
          <Route path="events" element={<Events />} />
          <Route path="event-details" element={<EventDetail />} />
          <Route path="fundraising" element={<Fundraising />} />
          <Route path="chapter-details-nat" element={<ChapterDetailsNational />} />
          <Route path="chapter-details" element={<ChapterDetails />} />
        </Route>
        <Route path="/" element={<SignIn />} />
        <Route path="/chapter-dashboard/fundraising/add-fundraising" element={<AddFundraising />}/>
        <Route path="/national-dashboard/fundraising/add-fundraising" element={<AddFundraising />}/>
        <Route path="/chapter-dashboard/events/event-details" element={<EventDetail />}/>
        <Route path="/national-dashboard/events/event-details" element={<EventDetail />}/>
        <Route path="/chapter-dashboard/fundraising/fundraising-detail" element={<FundraisingDetail />}/>
        <Route path="/national-dashboard/fundraising/fundraising-detail" element={<FundraisingDetail />}/>
      </Routes>
    </Router>
  </UserProvider>
  );
}

export default App;
