import React, { useState } from "react";
import "../styles/Collections.css";
import dummyReward from "../assets/dummy_reward02.jpg";

function Collections() {
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };
  return (
    <div className="collections-main-container">
      <div className="collection-input">
        <span className="collections-all">Collections</span>
        <div className="collections-list">
          <select value={selectedOption} onChange={handleSelectChange}>
            <option value="">Select a Collection</option>
            <option value="Option 1">Option 1</option>
            <option value="Option 2">Option 2</option>
            <option value="Option 3">Option 3</option>
          </select>
        </div>
      </div>
      <div className="collections-container">
        <h2>Collection: "{selectedOption}"</h2>
        {/* collection rewards container  */}

        <div className="collections-grid-main">
          <div className="collections-grid-item">
            <div className="collections-image">
              <img src={dummyReward} alt="reward nft" />
            </div>
            <div className="collections-nft-details">
              <span className="nft-title">nft title</span>
              <span className="nft-collection">artist name</span>
            </div>
          </div>
          <div className="collections-grid-item">
            <div className="collections-image">
              <img src={dummyReward} alt="reward nft" />
            </div>
            <div className="collections-nft-details">
              <span className="nft-title">nft title</span>
              <span className="nft-collection">artist name</span>
            </div>
          </div>
        </div>

        {/* collection not found container  */}
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
      </div>
    </div>
  );
}

export default Collections;
