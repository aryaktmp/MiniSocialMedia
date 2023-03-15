import React, { useEffect, useState } from "react";
import textLogo from "./../../assets/images/text-logo-rekin.png";
import "../../assets/css/components/navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { notification } from "antd";
import { Dropdown } from "antd";
import axios from "axios";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("auth"));
  const token = localStorage.getItem("token");
  let [auth, setAuth] = useState(null);
  const navigate = useNavigate();

  const [isActiveHamburg, setIsActiveHamburg] = useState(true);
  const [activeMenu, setActiveMenu] = useState(false);

  const logoutHandler = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:8000/api/logout")
      .then((res) => {
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
        navigate("/rekin/all");
        notification.open({
          icon: (
            <i
              style={{ color: "#20bf55" }}
              className="fa-solid fa-circle-check"
            ></i>
          ),
          message: "You Succes to logout!!",
          duration: 2,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
        <NavLink className="drop-menu" onClick={logoutHandler}>
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </NavLink>
      ),
    },
  ];
  useEffect(() => {
    setAuth(JSON.parse(localStorage.getItem("auth")));
  }, []);

  const handlerHamburg = () => {
    if (isActiveHamburg === true) {
      setIsActiveHamburg(false);
      setActiveMenu(true);
    } else {
      setIsActiveHamburg(true);
      setActiveMenu(false);
    }
  };

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
          <>
            <div className="auth">
              <NavLink className="login" to="/login">
                Login
              </NavLink>
              <NavLink className="register" to="/register">
                Register
              </NavLink>
            </div>
            <div className="hamburg-menu">
              {isActiveHamburg ? (
                <div className="active">
                  <i onClick={handlerHamburg} className="fa-solid fa-bars"></i>
                </div>
              ) : (
                <div className="non-active">
                  <i onClick={handlerHamburg} className="fa-solid fa-xmark"></i>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="profile">
              <div className="search">
                <i
                  onClick={handlerHamburg}
                  class="fa-solid fa-magnifying-glass"
                ></i>
              </div>
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
          </>
        )}
        <div className={activeMenu ? "menu active" : "menu non-active"}>
          <div className="search">
            <input type="text" placeholder="Search for status" />
          </div>
          {token === null ? (
            <div className="auth-menu">
              <NavLink className="login" to="/login">
                Login
              </NavLink>
              <NavLink className="register" to="/register">
                Register
              </NavLink>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
