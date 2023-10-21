import { QrScanner } from "@yudiel/react-qr-scanner";
import React, { useState } from "react";

function ScanTicket() {
  const [msg, setmsg] = useState("");
  return (
    <div>
      <QrScanner
        onDecode={(result) => {
          setmsg(result);
        }}
        onError={(error) => {
          setmsg(error?.message);
        }}
      />
    </div>
  );
}

export default ScanTicket;
