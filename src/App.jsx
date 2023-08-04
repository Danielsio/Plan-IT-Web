import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import About from "./pages/About";
import GenerateCalendar from "./pages/GenerateCalendar";
import EditPreferences from "./pages/EditPreferences";
import Navbar from "./components/common/Navbar.jsx";
import Footer from "./components/common/Footer.jsx";
import React from "react";
import {UserProvider} from "./context/UserContext";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCoursesDashboard from "./pages/AdminCoursesDashboard";
import AdminUsersDashboard from "./pages/AdminUsersDashboard";
import AdminHolidaysDashboard from "./pages/AdminHolidaysDashboard";
import EditCourse from "./pages/EditCourse";
import AddCourse from "./pages/AddCourse";
import FirstSetupPage from "./pages/FirstSetupPage";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer} from "react-toastify";
import DarkMode from "./components/profile/DarkModeToggle.jsx";

function App() {
    return (
        <div className="app">

            <Router>
                <UserProvider>
                    <Navbar/>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/profile" element={<Profile/>}/>
                        <Route path="/about" element={<About/>}/>
                        <Route path="/generate-calendar" element={<GenerateCalendar/>}/>
                        <Route path="/edit-preferences" element={<EditPreferences/>}/>
                        <Route path="/admin" element={<AdminDashboard/>}/>
                        <Route path="/admin/edit-course" element={<EditCourse/>}/>
                        <Route path="/admin/add-course" element={<AddCourse/>}/>
                        <Route path="/first-setup" element={<FirstSetupPage/>}/>
                        <Route
                            path="/admin/courses-dashboard"
                            element={<AdminCoursesDashboard/>}
                        />
                        <Route
                            path="/admin/users-dashboard"
                            element={<AdminUsersDashboard/>}
                        />
                        <Route
                            path="/admin/holidays-dashboard"
                            element={<AdminHolidaysDashboard/>}
                        />
                        w
                    </Routes>
                    <Footer/>
                    <ToastContainer
                        position="bottom-left"
                        autoClose={10000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick={false}
                        rtl={false}
                        pauseOnFocusLoss
                        draggable={false}
                        pauseOnHover
                        theme="colored"
                    />
                </UserProvider>
            </Router>
        </div>
    );
}

export default App;
