import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import SidebarLeft from "../sidebar/SidebarAuth";
import "./../../assets/css/layout/Layout.css";

const GuestLayout = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // console.log(isExpired)
    if (localStorage.getItem("token") !== null) {
      navigate("/rekin/home/all");
    }
  }, []);

  return (
    <>
      <div className="wrapper-navbar">
        <Navbar />
      </div>
      <div className="wrapper-content">
        <div className="main">{children}</div>
        <div className="sidebar-right"></div>
      </div>
    </>
  );
};

export default GuestLayout;
