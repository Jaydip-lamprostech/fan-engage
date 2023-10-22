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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          style={{ fill: "white" }}
        >
          <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
        </svg>
      </div>
      {props.extraComponent === "scan-ticket" ? (
        <ScanTicket address={props.address} />
      ) : null}
    </div>
  );
}

export default ExtraParentComponent;
