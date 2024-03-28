import React, {useState} from "react";
import basestyle from "../Base.module.css";
import loginstyle from "./Login.module.css";
import axios from "axios";
import {useNavigate, NavLink} from "react-router-dom";

const Login = ({setUserState}) => {
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});
    const [user, setUserDetails] = useState({
        email: "",
        password: "",
    });

    const changeHandler = (e) => {
        const {name, value} = e.target;
        setUserDetails({
            ...user,
            [name]: value,
        });
    };

    const validateForm = (values) => {
        const error = {};
        const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!values.email) {
            error.email = "Email is required";
        } else if (!regex.test(values.email)) {
            error.email = "Please enter a valid email address";
        }
        if (!values.password) {
            error.password = "Password is required";
        }
        return error;
    };

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/api/auth/signin", user);
            const {jwt} = response.data;
            console.log(response.data);
            localStorage.setItem("jwtToken", jwt);
            localStorage.setItem("userId", response.data.id);
            // Set Axios Authorization header for subsequent requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
            setUserState(jwt);

            if (response.data.authorities[0].authority === "STUDENT") {
                localStorage.setItem("groupId", response.data.group.id)
                navigate("/student")
            } else if (response.data.authorities[0].authority === "TEACHER") {
                localStorage.setItem("groupId", response.data.group.id)
                navigate("/teacher")
            } else {
                navigate("/dashboard");
            }
            setTimeout(() => {
                localStorage.removeItem("jwtToken");
                setUserState(null);
                navigate("/login");
            }, 3600000); // 1 hour in milliseconds
        } catch (error) {
            console.error("Login error:", error);
            if (error.response && error.response.status === 401) {
                setFormErrors({message: "Invalid email or password"});
            } else {
                setFormErrors({message: "An error occurred. Please try again later."});
            }
        }
    };

    return (
        <div className={loginstyle.login}>
            <form>
                <h1>Login</h1>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    onChange={changeHandler}
                    value={user.email}
                />
                <p className={basestyle.error}>{formErrors.email}</p>
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    onChange={changeHandler}
                    value={user.password}
                />
                <p className={basestyle.error}>{formErrors.password}</p>
                <button className={basestyle.button_common} onClick={loginHandler}>
                    Login
                </button>
                {formErrors.message && <p className={basestyle.error}>{formErrors.message}</p>}
            </form>
            <NavLink to="/signup">Not yet registered? Register Now</NavLink>
        </div>
    );
};

export default Login;
