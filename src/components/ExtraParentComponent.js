import React from "react";
import "../styles/ExtraParentComponent.css";
import ScanTicket from "./ScanTicket";

function ExtraParentComponent(props) {
  return (
    <div className="extra-main">
      <div
        className="close-extra-main"
        onClick={() => props.setExtraComponent("")}
      >
        close
      </div>
      {props.extraComponent === "scan-ticket" ? <ScanTicket /> : null}
    </div>
  );
}

export default ExtraParentComponent;
