import React from "react";
import "../styles/ScanTicketBottom.css";

function ScanTicketBottomComponent(props) {
  return (
    <div
      className={`scan-ticket-component-parent ${
        props.showScanTicketComponent ? "active" : ""
      }`}
      onClick={() => props.setShowScanTicketComponent(false)}
    >
      <div className="scan-ticket-component">
        <h2>Scan Your Ticket</h2>
        <div className="content">
          <div
            className="scan-ticket-item"
            onClick={() => props.setExtraComponent("scan-ticket")}
          >
            <div className="scan-ticket-item-inside">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path d="M90-730.001v-179.998H270v59.998h-120v120H90.001Zm720.001 0v-120h-120v-59.998h179.998v179.998h-59.998Zm-720 680v-179.998h59.998v120h120v59.998H90.001Zm600 0v-59.998h120v-120h59.998v179.998H690.001ZM269.999-242.308q0 4.616 3.847 8.462 3.846 3.847 8.462 3.847h395.384q4.616 0 8.462-3.847 3.847-3.846 3.847-8.462v-475.384q0-4.616-3.847-8.462-3.846-3.847-8.462-3.847H282.308q-4.616 0-8.462 3.847-3.847 3.846-3.847 8.462v475.384Zm12.309 72.307q-30.308 0-51.307-21-21-20.999-21-51.307v-475.384q0-30.308 21-51.307 20.999-21 51.307-21h395.384q30.308 0 51.307 21 21 20.999 21 51.307v475.384q0 30.308-21 51.307-20.999 21-51.307 21H282.308Zm87.693-400h219.998v-59.998H370.001v59.998Zm0 120h219.998v-59.998H370.001v59.998Zm0 120h219.998v-59.998H370.001v59.998Zm-100.002 87.693v-487.693 500.002-12.309Z" />
              </svg>
              <span>Scan Ticket</span>
            </div>
            <div className="scan-ticket-item-two">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path d="m517.847-480-184-184L376-706.153 602.153-480 376-253.847 333.847-296l184-184Z" />
              </svg>
            </div>
          </div>{" "}
          <div className="scan-ticket-item">
            <div className="scan-ticket-item-inside">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path d="M170.001-180.001q-29.154 0-49.577-20.423t-20.423-49.577v-457.69q0-29.154 21.577-50.731t50.731-21.577h219.613l80 80h315.769q26.846 0 46.307 17.346Q853.46-665.307 856.537-640H447.385l-80-80H172.309q-5.385 0-8.847 3.462-3.462 3.462-3.462 8.847v455.382q0 4.231 2.116 6.924 2.115 2.692 5.577 4.616L261-552.307h666.307l-96.846 322.614q-6.846 22.538-25.654 36.115-18.807 13.577-41.73 13.577H170.001ZM230.537-240H770.77l75.462-252.309H305.999L230.537-240Zm0 0 75.462-252.309L230.537-240ZM160-640v-80 80Z" />
              </svg>
              <span>My Scans</span>
            </div>
            <div className="scan-ticket-item-two">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path d="m517.847-480-184-184L376-706.153 602.153-480 376-253.847 333.847-296l184-184Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScanTicketBottomComponent;
