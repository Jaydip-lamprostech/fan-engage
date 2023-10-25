import React, { useEffect, useState } from "react";
import { ethers, Wallet, getDefaultProvider } from "ethers";
import { Database } from "@tableland/sdk";
import dotenv from "dotenv";
import "../styles/MyRewards.css";
import dummyReward from "../assets/dummy_reward02.jpg";
function MyRewards({ address }) {
  // const connected = address.eoa;
  console.log(address);
  const [data, setData] = useState([]);
  const getRewardsData = async () => {
    if (address) {
      const privateKey = process.env.REACT_APP_PRIVATE_KEY;
      const wallet = new Wallet(privateKey);
      const provider = getDefaultProvider(
        "https://polygon-mumbai.g.alchemy.com/v2/NeTaVDMNuGBLmW387WgXEvHrnLxRURwE"
      );
      const signer = wallet.connect(provider);
      const db = new Database({ signer });

      const FanPrefix = "fantabledata_80001_8210";
      const { results } = await db.prepare(`SELECT * FROM ${FanPrefix}`).all();
      console.table(results);
      let data2 = [];
      for (let i = 0; i < results.length; i++) {
        console.log(results[i]);
        if (results[i].eoa === address.eoa) {
          if (!data2.find((item) => results[i].id === data2.id)) {
            data2.push(results[i]);
          }
        }
      }
      console.log(data2);
      setData(data2);
    }
  };

  useEffect(() => {
    getRewardsData();
  }, [address]);

  if (data.length > 0) {
    return (
      <div>
        {/* rewards container  */}
        <div className="rewards-container">
          <div className="rewards-grid-main">
            {data.length > 0
              ? data.map((item, key) => {
                  return (
                    <div className="rewards-grid-item">
                      <div className="rewards-image">
                        <img src={item.scanned_image} alt="reward nft" />
                      </div>
                      <div className="rewards-nft-details">
                        <span className="nft-title">{item.event_name}</span>
                      </div>
                    </div>
                  );
                })
              : "null"}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="no-rewards-container">
        <div className="no-rewards-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
            className="icon"
          >
            <path d="m98-537 168-168q14-14 33-20t39-2l52 11q-54 64-85 116t-60 126L98-537Zm205 91q23-72 62.5-136T461-702q88-88 201-131.5T873-860q17 98-26 211T716-448q-55 55-120 95.5T459-289L303-446Zm276-120q23 23 56.5 23t56.5-23q23-23 23-56.5T692-679q-23-23-56.5-23T579-679q-23 23-23 56.5t23 56.5ZM551-85l-64-147q74-29 126.5-60T730-377l10 52q4 20-2 39.5T718-252L551-85ZM162-318q35-35 85-35.5t85 34.5q35 35 35 85t-35 85q-25 25-83.5 43T87-74q14-103 32-161t43-83Z" />
          </svg>
        </div>
        <div className="no-rewards-info">
          <span className="no-rewards-info-title">
            Get tickets and get started!
          </span>
          <span className="no-rewards-info-description">
            Start by scanning your ticket and mint the nft.
          </span>
        </div>
      </div>
    );
  }
}
export default MyRewards;
