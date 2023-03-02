import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../navbar";
import Sidebar from "../sidebar";

const AuthLayout = ({ children }) => {
  const navigate = useNavigate();
  const [isExpired, setIsExpired] = useState(false);

  const fetchUser = async () => {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${localStorage.getItem("token")}`;

    try {
      const response = await axios.get("http://localhost:8000/api/user");
      console.log(response);
      if (!response.data) {
        setIsExpired(true);
      } else {
        setIsExpired(false);
        localStorage.setItem("auth", JSON.stringify(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // let token = localStorage.getItem("token");
    // let dateNow = new Date();
    // let expToken = jwt_decode(token);

    // // console.log(expToken.exp * 1000 < dateNow.getTime());
    // // console.log(isExpired);
    // // console.log(dateNow.getTime());
    // // console.log(expToken.exp * 1000);

    // if ((expToken.exp * 1000) <= dateNow.getTime()) {
    //   setIsExpired(true);
    // } else {
    //   setIsExpired(false);
    // }
    fetchUser();
    if (isExpired == true) {
      localStorage.removeItem("token");
      localStorage.removeItem("auth");
      navigate("/login");
    }
  }, [fetchUser()]);

  return (
    <>
      <div className="wrapper-navbar">
        <Navbar />
      </div>
      <div className="wrapper-sidebar">
        <Sidebar/>
      </div>
      {children}
    </>
  );
};

export default AuthLayout;
