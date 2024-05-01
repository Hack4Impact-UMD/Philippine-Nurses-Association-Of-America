import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import RequireAuth from "./auth/RequireAuth/RequireAuth";
import ChapterDetails from "./pages/chapter-details/AllChapterDetails/ChapterDetails";
import Dashboard from "./pages/dashboard/Dashboard";
import ForgotPassword from "./pages/forgotpassword/ForgotPassword";
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
                <Dashboard />
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
            <Route path="events" element={<Events />} />
            <Route path="event-details" element={<EventDetail />} />
            <Route path="fundraising" element={<Fundraising />} />
            <Route
              path="chapter-details-nat"
              element={<ChapterDetailsNational />}
            />
            <Route path="chapter-details" element={<ChapterDetails />} />
          </Route> */
}
{
  /* <Route
            path="/details"
            element={
              <RequireAuth>
                <ChapterDetails />
              </RequireAuth>
            }
          />

          <Route
            path="/chapter-dashboard/fundraising/add-fundraising"
            element={<AddFundraising />}
          />
          <Route
            path="/chapter-dashboard/events/event-details"
            element={<EventDetail />}
          />
          <Route
            path="/chapter-dashboard/fundraising/fundraising-detail"
            element={<FundraisingDetail />}
          /> */
}
