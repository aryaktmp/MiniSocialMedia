import React from "react";
import "./../assets/css/loadingPages.css";

export default function LoadingPages() {
  return (
    <div className="wrapper-loader">
      <div className="leap-frog">
        <div className="leap-frog__dot"></div>
        <div className="leap-frog__dot"></div>
        <div className="leap-frog__dot"></div>
      </div>
    </div>
  );
}
