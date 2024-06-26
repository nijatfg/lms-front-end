import React, { useState } from "react";
import loginstyle from "./Login.module.css";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";

const Login = ({ setUserState }) => {
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});
    const [user, setUserDetails] = useState({
        email: "",
        password: "",
    });

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setUserDetails({
            ...user,
            [name]: value,
        });
    };
    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/signin",
                user
            );
            const { jwt } = response.data;
            localStorage.setItem("jwtToken", jwt);
            localStorage.setItem("userId", response.data.id);
            axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
            setUserState(jwt);

            const passwordChangedResponse = await axios.get(
                `http://localhost:8080/api/v1/users/${response.data.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );

            const { passwordChanged } = passwordChangedResponse.data;

            if (response.data.authorities[0].authority === "STUDENT") {
                localStorage.setItem("groupId", response.data.group.id);
                localStorage.setItem("userRole",response.data.authorities[0].authority);
                if (!passwordChanged) {
                    navigate("/changePassword");
                } else {
                    navigate("/student");
                }
            } else if (response.data.authorities[0].authority === "TEACHER") {
                localStorage.setItem("groupId", response.data.group.id);
                localStorage.setItem("userRole",response.data.authorities[0].authority);
                if (!passwordChanged) {
                    navigate("/changePassword");
                } else {
                    navigate("/teacher");
                }
            } else {
                navigate("/dashboard");
            }

            setTimeout(() => {
                localStorage.removeItem("jwtToken");
                setUserState(null);
                navigate("/login");
            }, 3600000);
        } catch (error) {
            console.error("Login error:", error);
            if (error.response && error.response.status === 401) {
                setFormErrors({ message: "Invalid email or password" });
            } else {
                setFormErrors({
                    message: "An error occurred. Please try again later.",
                });
            }
        }
    };

    return (
        <div className={loginstyle.loginContainer}>
            <div className={loginstyle.logoContainer}>
                <img
                    src="https://uiwjs.github.io/react-login-page/static/media/banner.a05effbe434b6c99458f.jpg"
                    alt="Logo"
                    className={loginstyle.logo}
                />
            </div>
            <div className={loginstyle.formContainer}>
                <h3 className={loginstyle.formTitle}>Log in</h3>
                <form className={loginstyle.form}>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        onChange={changeHandler}
                        value={user.email}
                        className={loginstyle.input}
                    />
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        onChange={changeHandler}
                        value={user.password}
                        className={loginstyle.input}
                    />
                    <button className={loginstyle.loginButton} onClick={loginHandler}>
                        Submit
                    </button>
                    {formErrors.message && (
                        <p className={loginstyle.errorMessage}>{formErrors.message}</p>
                    )}
                </form>
                {/*<NavLink to="/signup" className={loginstyle.registerLink}>*/}
                {/*    Not yet registered? Register Now*/}
                {/*</NavLink>*/}
            </div>
        </div>
    );
};

export default Login;
