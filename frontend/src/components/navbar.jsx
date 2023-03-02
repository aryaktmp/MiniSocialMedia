import React from "react";
import textLogo from "./../assets/images/text-logo-rekin.png";

const Navbar = () => {
  return (
    <nav className="nav">
      <div className="nav-brand">
        <img src={textLogo} alt="" />
      </div>
      <ul className="nav-menu">
      </ul>
    </nav>
  );
};

export default Navbar;
