import React from "react";
import "../styles/MobileHeader.css";

function MobileHeader(props) {
  return (
    <div className="mobile-header">
      <div className="header-left">
        <h1>{props.component}</h1>
      </div>
      <div className="header-right">
        <span>Help Icon</span>
      </div>
    </div>
  );
}

export default MobileHeader;
