import React, { useEffect, useState } from "react";
import basestyle from "../Base.module.css";
import registerstyle from "./Register.module.css";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUserDetails] = useState({
    email: "",
    username: "",
    password: "",
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
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
      error.email = "This is not a valid email format!";
    }
    if (!values.username) {
      error.username = "Username is required";
    }
    if (!values.password) {
      error.password = "Password is required";
    } else if (values.password.length < 4) {
      error.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      error.password = "Password cannot exceed more than 10 characters";
    }
    return error;
  };

  const signupHandler = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(user));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      axios.post("http://localhost:8080/api/auth/signup", user)
        .then(() => {
          alert("Registration successful! Please login.");
          navigate("/login"); // Redirect to login page after successful registration
        })
        .catch((error) => {
          console.error("Registration error:", error);
          // Handle registration errors, display error messages, etc.
        });
    }
  }, [formErrors]);

  return (
    <div className={registerstyle.register}>
      <form>
        <h1>Create your account</h1>
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
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          onChange={changeHandler}
          value={user.username}
        />
        <p className={basestyle.error}>{formErrors.username}</p>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          onChange={changeHandler}
          value={user.password}
        />
        <p className={basestyle.error}>{formErrors.password}</p>
        <button className={basestyle.button_common} onClick={signupHandler}>
          Register
        </button>
      </form>
      <NavLink to="/login">Already registered? Login</NavLink>
    </div>
  );
};

export default Register;
