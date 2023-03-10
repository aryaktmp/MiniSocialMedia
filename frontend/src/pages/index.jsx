import React, { useEffect, useState } from "react";
import { notification, Input, List, Divider, Skeleton } from "antd";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import logoRekin from "./../assets/images/logo-rekin2.png";
import "./../assets/css/style.css";

const Index = () => {
  const navigate = useNavigate();
  let [token, setToken] = useState(null);
  let [auth, setAuth] = useState(null);

  const checkToken = () => {
    navigate("/login");
    notification.open({
      icon: (
        <i
          style={{ color: "#ff6b35" }}
          className="fa-solid fa-circle-exclamation"
        ></i>
      ),
      message: "You Must Be Login!",
      description: "Must login before doing activity",
      duration: 2,
    });
  };

  useEffect(() => {
    document.title = "Welcome to Rekin";
    setToken(localStorage.getItem("token"));
    setAuth(JSON.parse(localStorage.getItem("auth")));
  }, []);

  return (
    <>
      <div className="main-header">
        <div className="header">
          <NavLink to={!token ? "/rekin/all" : "/rekin/home/all"}>
            <img src={logoRekin} alt="" />
          </NavLink>
        </div>
        <div className="nav-tabs">
          <ul>
            <li>
              <NavLink
                to="all"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                All Status
              </NavLink>
            </li>
            <li>
              {!token ? (
                <span onClick={checkToken}>Your Status</span>
              ) : (
                <NavLink
                  to="your-status"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Your Status
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Index;
