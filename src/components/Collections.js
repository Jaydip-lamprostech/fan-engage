import React, { useEffect, useState } from "react";
import { ethers, Wallet, getDefaultProvider } from "ethers";
import { Database } from "@tableland/sdk";
import "../styles/Collections.css";
import dummyReward from "../assets/dummy_reward02.jpg";

function Collections({ address }) {
  const [selectedOption, setSelectedOption] = useState("");
  const [data, setData] = useState([]);
  const [collections, setCollections] = useState([]);
  const [collectionData, setCollectionData] = useState([]);

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
      let collection2 = [];
      for (let i = 0; i < results.length; i++) {
        console.log(results[i]);

        if (!data2.find((item) => results[i].id === item.id)) {
          data2.push(results[i]);
        }
        if (
          !collection2.find(
            (item) => results[i].collection_name === item.collection_name
          )
        ) {
          collection2.push(results[i].collection_name);
        }
      }
      console.log(data);
      console.log(collection2);
      setData(data2);
      setCollections(collection2);
    }
  };

  const handleSelectChange = async (e) => {
    setSelectedOption(e.target.value);
    console.log(e.target.value);
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
    setCollectionData(null);
    let collectionData2 = [];
    for (let i = 0; i < results.length; i++) {
      console.log(results[i]);
      if (results[i].eoa === address.eoa) {
        if (results[i].collection_name === e.target.value) {
          if (!collectionData2.find((item) => results[i].id === item.id)) {
            collectionData2.push(results[i]);
          }
        }
      }
    }
    console.log(collectionData2);
    setCollectionData(collectionData2);
  };

  useEffect(() => {
    getRewardsData();
  }, [address]);

  return (
    <div className="collections-main-container">
      <div className="collection-input">
        <span className="collections-all">Collections</span>
        {collections.length > 0 ? (
          <div className="collections-list">
            <select value={selectedOption} onChange={handleSelectChange}>
              <option value="">Select a Collection</option>
              {collections.map((item, key) => {
                return (
                  <option value={item} key={key}>
                    {item}
                  </option>
                );
              })}
            </select>
          </div>
        ) : (
          <div className="collections-list">
            <select value={selectedOption}>
              <option value="">Select a Collection</option>
            </select>
          </div>
        )}
      </div>
      <div className="collections-container">
        {selectedOption ? <h2>Collection: "{selectedOption}"</h2> : null}
        {/* collection rewards container  */}
        {collectionData.length > 0 ? (
          collectionData.map((item, key) => {
            return (
              <div className="collections-grid-main">
                <div className="collections-grid-item">
                  <div className="collections-image">
                    <img src={item.scanned_image} alt="reward nft" />
                  </div>
                  <div className="collections-nft-details">
                    <span className="nft-title">{item.event_name}</span>
                    <span className="nft-collection">artist name</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-rewards-container">
            <div className="no-rewards-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
                className="icon"
              >
                <path d="m354-247 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-80l65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Zm247-350Z" />
              </svg>
            </div>
            <div className="no-rewards-info">
              <span className="no-rewards-info-title">
                No NFTs found for this Collection. Try a different collection.
              </span>
              <span className="no-rewards-info-description">
                Start by scanning your ticket and mint the nft.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Collections;
