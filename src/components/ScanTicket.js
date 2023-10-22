import { QrScanner } from "@yudiel/react-qr-scanner";
import React, { useState } from "react";
import { ethers, Wallet, getDefaultProvider } from "ethers";
import { Database } from "@tableland/sdk";
import dotenv from "dotenv";
import "../styles/ScanTicket.css";
import dummyReward from "../assets/dummy_reward02.jpg";
import contractAbi from "../artifacts/MintNFT.json";

const contractAddress = "0x47FADCA50bBbBe74c48D6362c784BD0c3278b829";

function ScanTicket({ address }) {
  console.log(address);
  const [msg, setmsg] = useState("");

  const mint = async () => {
    const privateKey = process.env.REACT_APP_PRIVATE_KEY;
    const wallet = new Wallet(privateKey);
    const provider = getDefaultProvider(
      "https://polygon-mumbai.g.alchemy.com/v2/NeTaVDMNuGBLmW387WgXEvHrnLxRURwE"
    );
    const signer = wallet.connect(provider);

    const contract = new ethers.Contract(
      contractAddress,
      contractAbi.abi,
      signer
    );
    console.log("Minting NFT");
    const tx = await contract.safeMint(address.eoa, msg[0]["ticketImage"]);
    await tx.wait();
    console.log("NFT minted");

    // tableland integration

    const db = new Database({ signer });

    const FanPrefix = "fantabledata_80001_8210";

    console.log("Inserting...");

    // Insert a row into the table
    const { meta: insert } = await db
      .prepare(
        `INSERT INTO ${FanPrefix} (id, eoa, event_name, event_venue, scanned_image, rewards, collection_name) VALUES (?, ?, ?, ?, ?, ?,?);`
      )
      .bind(
        msg[0]["event_id"],
        address.eoa,
        msg[0]["eventName"],
        msg[0]["event_venue"],
        msg[0]["ticketImage"],
        msg[0]["ticketImage"],
        msg[0]["collection_name"]
      )
      .run();

    console.log("Inserted...");
  };
  // {
  //   eventName: "Music Festival",
  //   event_venue: "address",
  //   ticketImage: "2023-10-28",
  //   collection_name: "artist collection",
  // }
  return (
    <div className="scan-ticket-main-component">
      {!msg ? (
        <QrScanner
          onDecode={(result) => {
            console.log(result);
            setmsg(JSON.parse(result));
          }}
          onError={(error) => {
            setmsg(error?.message);
          }}
        />
      ) : null}
      <div>
        {msg ? (
          <div className="mint-nft-main">
            <h2>Ticket Details</h2>
            <div className="ticket-details-item">
              <span className="item-title">Event Name</span>
              <span className="item-value">{msg[0]["eventName"]}</span>
            </div>
            <div className="ticket-details-item">
              <span className="item-title">Event Venue</span>
              <span className="item-value">{msg[0]["event_venue"]}</span>
            </div>
            <div className="ticket-details-item">
              <span className="item-title">Collection Name</span>
              <span className="item-value">{msg[0]["collection_name"]}</span>
            </div>
            <div className="ticket-details-item">
              <span className="item-title">Event Ticket</span>
              <span className="item-value">
                <img src={msg[0]["ticketImage"]} alt="NFT" />
              </span>
            </div>
            <div className="ticket-details-item">
              <span className="item-value mint-nft">
                <button onClick={() => mint()}>Mint NFT</button>
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ScanTicket;
