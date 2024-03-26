import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";
import Profile from "./Components/Profile/Profile";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import ParticipationComponent from "./Components/Participation/ParticipationComponent";
import TeacherPage from "./Components/StudentPage/TeacherPage";
import "./App.css";

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
                </Routes>
            </Router>
        </div>
    );
}

export default App;
