import { QrScanner } from "@yudiel/react-qr-scanner";
import React, { useState } from "react";
import "../styles/ScanTicket.css";
import dummyReward from "../assets/dummy_reward02.jpg";

function ScanTicket() {
  const [msg, setmsg] = useState("");
  // {
  //   eventName: "Music Festival",
  //   event_venue: "address",
  //   ticketImage: "2023-10-28",
  //   collection_name: "artist collection",
  // }
  return (
    <div className="scan-ticket-main-component">
      <QrScanner
        onDecode={(result) => {
          setmsg(result);
        }}
        onError={(error) => {
          setmsg(error?.message);
        }}
      />
      <div>
        {msg ? (
          <div className="mint-nft-main">
            <h2>Ticket Details</h2>
            <div className="ticket-details-item">
              <span className="item-title">Event Name</span>
              <span className="item-value">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo,
                velit?
              </span>
            </div>
            <div className="ticket-details-item">
              <span className="item-title">Event Venue</span>
              <span className="item-value">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo,
                velit?
              </span>
            </div>
            <div className="ticket-details-item">
              <span className="item-title">Collection Name</span>
              <span className="item-value">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo,
                velit?
              </span>
            </div>
            <div className="ticket-details-item">
              <span className="item-title">Event Ticket</span>
              <span className="item-value">
                <img src={dummyReward} alt="" />
              </span>
            </div>
            <div className="ticket-details-item">
              <span className="item-value mint-nft">
                <button>Mint NFT</button>
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ScanTicket;
