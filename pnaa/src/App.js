import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import RequireAdminAuth from "./auth/RequireAdminAuth/RequireAdminAuth";
import RequireAuth from "./auth/RequireAuth/RequireAuth";
import ChapterDetails from "./pages/chapter-details/AllChapterDetails/ChapterDetails";
import SingleChapterDetails from "./pages/chapter-details/SingleChapterDetails/SingleChapterDetails";
import Dashboard from "./pages/dashboard/Dashboard";
import EventDetails from "./pages/events/EventDetails/EventDetails";
import Events1 from "./pages/events/Events";
import ForgotPassword from "./pages/forgotpassword/ForgotPassword";
import AddFundraising from "./pages/fundraising/AddFundraising/AddFundraising";
import Fundraising from "./pages/fundraising/Fundraising";
import FundraisingDetail from "./pages/fundraising/FundraisingDetails";
import Settings from "./pages/SettingsPage/Settings";
import SignIn from "./pages/signin/SignIn";
import SignUp from "./pages/signup/SignUp";
import Users from "./pages/users/Users";

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
            path="/details/chapter"
            element={
              <RequireAuth>
                <SingleChapterDetails />
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
          <Route
            path="/users"
            element={
              <RequireAdminAuth>
                <Users />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <Settings />
              </RequireAuth>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
