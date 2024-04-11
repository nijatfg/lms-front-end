import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";
import Profile from "./Components/Profile/Profile";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import ParticipationComponent from "./Components/Participation/ParticipationComponent";
import TeacherPage from "./Components/TeacherPage/TeacherPage";
import "./App.css";
import StudentPage from "./Components/Student/StudentPage";
import SubmitAssignmentComponent from "./Components/Submission/SubmitAssignmentComponent";// Import SubmitAssignmentComponent
import ManageCourse from "./Components/Course/ManageCourse";
import ManageUsers from "./Components/User/ManageUsers";
import ManageGroup from "./Components/Group/ManageGroup";
import ManageLessons from "./Components/Lesson/ManageLessons";
import ChangePassword from "./Components/Password/ChangePassword";

function App() {
    const [userState, setUserState] = useState({});

    useEffect(() => {
        console.log("User State:", userState);
        console.log("User ID:", userState._id);
        console.log("User Role:", userState.role);
    }, [userState]);

    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={
                            userState && userState._id ? (
                                userState.role === "admin" ? (
                                    <AdminDashboard
                                        setUserState={setUserState}
                                        username={userState.fname}
                                    />
                                ) : (
                                    <Profile
                                        setUserState={setUserState}
                                        username={userState.fname}
                                    />
                                )
                            ) : (
                                <Login setUserState={setUserState}/>
                            )
                        }
                    ></Route>
                    <Route
                        path="/login"
                        element={<Login setUserState={setUserState}/>}
                    ></Route>
                    <Route path="/signup" element={<Register/>}></Route>
                    <Route
                        path="/dashboard"
                        element={<AdminDashboard setUserState={setUserState}/>}
                    />
                    <Route
                        path="/participation"
                        element={<ParticipationComponent userId={userState._id}/>}
                    />
                    <Route path="/teacher" element={<TeacherPage/>}/>
                    <Route path="/student" element={<StudentPage/>}/>
                    {/* Add new route for SubmitAssignmentComponent */}
                    <Route path="/submit-assignment" element={<SubmitAssignmentComponent/>}></Route>
                    <Route path="/dashboard/users" element={<ManageUsers/>}></Route>
                    <Route path="/dashboard/courses" element={<ManageCourse/>}></Route>
                    <Route path="/dashboard/groups" element={<ManageGroup/>}></Route>
                    <Route path="/dashboard/lessons" element={<ManageLessons/>}></Route>
                    <Route path="/changePassword" element={<ChangePassword/>}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
