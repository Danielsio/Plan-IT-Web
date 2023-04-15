import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import About from "./pages/About";
import GenerateCalendar from "./pages/GenerateCalendar";
import EditPreferences from "./pages/EditPreferences";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import React, { useContext } from "react";
import { UserProvider } from "./context/UserContext";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import EditCoursePage from "./pages/AdminEditCoursePage";

function App() {
  return (
    <div className="app">
      <UserProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/generate-calendar" element={<GenerateCalendar />} />
            <Route path="/edit-preferences" element={<EditPreferences />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/edit-course" element={<EditCoursePage />} />
          </Routes>
          <Footer />
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;
