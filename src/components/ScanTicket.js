import { QrScanner } from "@yudiel/react-qr-scanner";
import React, { useState } from "react";
import "../styles/ScanTicket.css";

function ScanTicket() {
  const [msg, setmsg] = useState("");
  return (
    <div className="scan-ticket-component">
      <QrScanner
        onDecode={(result) => {
          setmsg(result);
        }}
        onError={(error) => {
          setmsg(error?.message);
        }}
      />
      <div>{msg ? <p>{msg}</p> : null}</div>
    </div>
  );
}

export default ScanTicket;
