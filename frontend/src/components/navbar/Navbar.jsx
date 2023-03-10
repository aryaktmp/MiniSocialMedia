import React, { useEffect, useState } from "react";
import textLogo from "./../../assets/images/text-logo-rekin.png";
import "../../assets/css/components/navbar.css";
import { NavLink } from "react-router-dom";
import { Dropdown } from "antd";

const user = JSON.parse(localStorage.getItem("auth"));

const items = [
  {
    key: "0",
    label: (
      <span className="drop-menu">
        Welcome, {user == null ? "" : user.name}
      </span>
    ),
  },
  {
    type: "divider",
  },
  {
    key: "1",
    label: (
      <NavLink
        className="drop-menu"
        target="_blank"
        rel="noopener noreferrer"
        to="/rekin/home"
      >
        Profile
      </NavLink>
    ),
  },
  {
    type: "divider",
  },
  {
    key: "2",
    danger: true,
    label: (
      <NavLink className="drop-menu">
        <i className="fa-solid fa-right-from-bracket"></i> Logout
      </NavLink>
    ),
  },
];

const Navbar = () => {
  let [token, setToken] = useState(null);
  let [auth, setAuth] = useState(null);
  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setAuth(JSON.parse(localStorage.getItem("auth")));
  }, []);
  return (
    <nav className="nav">
      <div className="nav-brand">
        <NavLink to="/rekin/all">
          <img src={textLogo} alt="" />
        </NavLink>
      </div>
      <ul className="nav-menu">
        <input type="text" placeholder="Search for status" />
      </ul>
      <div className="nav-auth">
        {token === null ? (
          <div className="auth">
            <NavLink className="login" to="/login">
              Login
            </NavLink>
            <NavLink className="register" to="/register">
              Register
            </NavLink>
          </div>
        ) : (
          <div className="profile">
            <Dropdown
              className="dropdown"
              arrow
              placement="bottomRight"
              menu={{
                items,
              }}
            >
              <img src={require("./../../assets/images/user.png")} alt="" />
            </Dropdown>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
