import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import RequireAuth from "./auth/RequireAuth/RequireAuth";
import ChapterDetails from "./pages/chapter-details/AllChapterDetails/ChapterDetails";
import Dashboard from "./pages/dashboard/Dashboard";
import EventDetails from "./pages/events/EventDetails";
import Events1 from "./pages/events/Events1";
import ForgotPassword from "./pages/forgotpassword/ForgotPassword";
import AddFundraising from "./pages/fundraising/AddFundraising";
import Fundraising from "./pages/fundraising/Fundraising";
import FundraisingDetail from "./pages/fundraising/FundraisingDetails";
import SignIn from "./pages/signin/SignIn";
import SignUp from "./pages/signup/SignUp";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <SignIn />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/details"
            element={
              <RequireAuth>
                <ChapterDetails />
              </RequireAuth>
            }
          />
          <Route
            path="/fundraising"
            element={
              <RequireAuth>
                <Fundraising />
              </RequireAuth>
            }
          />
          <Route
            path="/add-fundraising"
            element={
              <RequireAuth>
                <AddFundraising />
              </RequireAuth>
            }
          />
          <Route
            path="/fundraising-detail"
            element={
              <RequireAuth>
                <FundraisingDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/events"
            element={
              <RequireAuth>
                <Events1 />
              </RequireAuth>
            }
          />
          <Route
            path="/event-details"
            element={
              <RequireAuth>
                <EventDetails />
              </RequireAuth>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

{
  /* <Route path="/chapter-dashboard/*" element={<ChapterDash />}>
            <Route path="members" element={<MemberManagement />} />
            <Route path="member-detail" element={<MemberDetail />} />
            <Route path="fundraising" element={<Fundraising />} />
          </Route> */
}
{
  /* 


          <Route
            path="/chapter-dashboard/events/event-details"
            element={<EventDetail />}
          />
*/
}
