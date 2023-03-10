import React, { useEffect, useState } from "react";
import "./../../assets/css/auth/login.css";
import LogoRekin from "./../../assets/images/logo-rekin2.png";
import { Input } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingPages from "../../components/loadingPage";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadings, isLoadings] = useState(false);

  const [validation, setValidation] = useState([]);

  const loginHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("email", email);
    formData.append("password", password);
    isLoadings(true);
    await axios
      .post("http://localhost:8000/api/login", formData)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        // localStorage.setItem("auth", JSON.stringify(response.data.user));
        navigate("/rekin/home/all");
        isLoadings(false);
      })
      .catch((error) => {
        setValidation(error.response.data);
        isLoadings(false);
      });
  };

  useEffect(() => {
    document.title = "Login - Rekin";
    if (localStorage.getItem("token") !== null) {
      navigate("/rekin/home/all");
    }
  }, []);

  return (
    <>
      {loadings === true ? <LoadingPages /> : ""}
      <div className="wrapper-login">
        <div className="card-login">
          <div className="header-card">
            <div className="image">
              <NavLink to="/rekin/all">
                <img src={LogoRekin} alt="" />
              </NavLink>
            </div>
            <div className="header-text">
              <h1>LogIn</h1>
            </div>
          </div>
          <form onSubmit={loginHandler} className="body-form">
            <label htmlFor="">Enter your email and password</label>
            <div className="form-grp">
              <Input
                type="email"
                className={
                  validation.password != null
                    ? "error-message"
                    : "form-inp" && validation.message != null
                    ? "error-message"
                    : "form-inp"
                }
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {validation.email && (
                <small className="error-validation">
                  {validation.email[0]}
                </small>
              )}
              {validation.message && (
                <small className="error-validation">{validation.message}</small>
              )}
              <Input.Password
                className={
                  validation.password != null
                    ? "error-message"
                    : "form-inp" && validation.message != null
                    ? "error-message"
                    : "form-inp"
                }
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {validation.password && (
                <small className="error-validation">
                  {validation.password[0]}
                </small>
              )}
              {validation.message && (
                <small className="error-validation">{validation.message}</small>
              )}
            </div>
            <div className="form-butt">
              <button type="submit">Login</button>
              <NavLink to="/register">Don't have any account?</NavLink>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default Login;
