import React from "react";
import "../styles/MobileHeader.css";

function MobileHeader() {
  return (
    <div className="mobile-header">
      <div className="header-left">
        <h1>My Rewards</h1>
      </div>
      <div className="header-right">
        <span>Help Icon</span>
      </div>
    </div>
  );
}

export default MobileHeader;
