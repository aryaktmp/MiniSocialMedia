import React, { useEffect, useState } from "react";
import "./../../assets/css/register.css";
import LogoRekin from "./../../assets/images/logo-rekin2.png";
import { Input } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingPages from "../../components/loadingPage";

const Register = () => {
  const navigate = useNavigate();
  const [loadings, isLoadings] = useState(false);

  const [name, setName] = useState("");
  const [noTelp, setNoTelp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [validation, setValidation] = useState([]);

  const registerHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("no_telp", noTelp);
    formData.append("password", password);
    formData.append("password_confirmation", passwordConfirmation);

    isLoadings(true);
    await axios
      .post("http://localhost:8000/api/register", formData)
      .then((response) => {
        navigate("/login");
        isLoadings(false);
      })
      .catch((error) => {
        setValidation(error.response.data);
        isLoadings(false);
      });
  };

  useEffect(() => {
    document.title = "Register - Rekin";
  });
  return (
    <>
      {loadings == true ? <LoadingPages /> : ""}
      <div className="wrapper-register">
        <div className="card-register">
          <div className="header-card">
            <div className="image">
              <img src={LogoRekin} alt="" />
            </div>
            <div className="header-text">
              <h1>Register</h1>
            </div>
          </div>
          <form onSubmit={registerHandler} className="body-form">
            <label htmlFor="">Enter your Register Credentials</label>
            <div className="form-grp">
              <Input
                className={
                  validation.name != null ? "error-message" : "form-inp"
                }
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {validation.name && (
                <small className="error-validation">{validation.name[0]}</small>
              )}
              <Input
                className={
                  validation.email != null ? "error-message" : "form-inp"
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
              <Input
                className={
                  validation.no_telp != null ? "error-message" : "form-inp"
                }
                type="number"
                maxLength={15}
                placeholder="Enter Your No Telp"
                value={noTelp}
                onChange={(e) => setNoTelp(e.target.value)}
              />
              {validation.no_telp && (
                <small className="error-validation">
                  {validation.no_telp[0]}
                </small>
              )}
              <Input.Password
                className={
                  validation.password != null ? "error-message" : "form-inp"
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
              <Input.Password
                className={
                  validation.password != null ? "error-message" : "form-inp"
                }
                placeholder="Enter Your Password Confirmation"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
              {validation.password && (
                <small className="error-validation">
                  {validation.password[0]}
                </small>
              )}
            </div>
            <div className="form-butt">
              <button type="submit">Register</button>
              <NavLink to="/login">Already Registered?</NavLink>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default Register;
