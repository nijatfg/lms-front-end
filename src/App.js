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
import GetMaterialComponent from "./Components/Material/GetMaterialComponent";
import ViewAssignments from "./Components/Assignment/ViewAssignments";
import ViewGroupUsers from "./Components/Group/ViewGroupUsers";
import ChatRoom from "./Components/Chat/ChatRoom";
import ParticipationComponentStudent from "./Components/Participation/ParticipationComponentStudent";
import GetMaterialPage from "./Components/Material/GetMaterialPage";
import TaskDetails from "./Components/Assignment/TaskDetails";
import UploadMaterialComponent from "./Components/Material/UploadMaterialComponent";
import ManageAssignments from "./Components/Assignment/ManageAssignments";
import TaskSubmission from "./Components/Submission/TaskSubmission";

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
                        path="/teacher/participation"
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
                    <Route path="/student/materials" element={<GetMaterialPage/>}/>
                    <Route path="/student/materials/files" element={<GetMaterialComponent/>}/>
                    <Route path="/student/assignments" element={<ViewAssignments/>}/>
                    <Route path="/student/group" element={<ViewGroupUsers/>}/>
                    <Route path="/student/chat" element={<ChatRoom/>}/>
                    <Route path="/student/participation" element={<ParticipationComponentStudent/>}/>
                    <Route path="/teacher/participation" element={<ParticipationComponent/>}/>
                    <Route path="/teacher/material" element={<UploadMaterialComponent/>}/>
                    <Route path="/teacher/assignment" element={<ManageAssignments/>}/>
                    <Route path="/teacher/submission" element={<TaskSubmission/>}/>
                    <Route path="/teacher/group" element={<ViewGroupUsers/>}/>
                    <Route path="/teacher/chat" element={<ChatRoom/>}/>
                    <Route path="/task-details/:assignmentId" element={<TaskDetails />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
