import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Web3AuthModalPack, Web3AuthConfig } from "@safe-global/auth-kit";
import { Web3AuthOptions } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import MobileFooter from "./components/MobileFooter";
import MobileHeader from "./components/MobileHeader";
import MyRewards from "./components/MyRewards";
import Collections from "./components/Collections";
import Rank from "./components/Rank";
import Profile from "./components/Profile";
import { ethers } from "ethers";
import { EthersAdapter, SafeFactory } from "@safe-global/protocol-kit";
import ScanTicketBottomComponent from "./components/ScanTicketBottomComponent";
import ExtraParentComponent from "./components/ExtraParentComponent";

// The signIn() method will return the user's Ethereum address
// The await will last until the user is authenticated, so while the UI modal is showed

function App() {
  const [safeInstance, setSafeInstance] = useState();
  const [showScanTicketComponent, setShowScanTicketComponent] = useState(false);
  const [userDetails, setUserDetails] = useState();
  const [activeComponent, setActiveComponent] = useState("My Rewards");
  const [extraComponent, setExtraComponent] = useState("");
  const [address, setAddress] = useState();
  const [isCompatible, setIsCompatible] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsCompatible(false);
      } else {
        setIsCompatible(true);
      }
    };

    // Add event listener to listen for window resize
    window.addEventListener("resize", handleResize);

    // Call handleResize once on component mount
    handleResize();

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className="App">
      {isCompatible ? (
        <>
          <div className="home-page">
            <MobileHeader
              component={activeComponent}
              setAddress={setAddress}
              address={address}
            />
            {/* <div style={{ marginTop: "100px" }}>
        <button onClick={authKitSignData}>Login</button>
      </div>
      <div>
        <button onClick={signOut}>Sign Out</button>
      </div>
      <div>
        <button onClick={deploySafe}>Deploy Safe</button>
      </div> */}
            {activeComponent === "My Rewards" ? (
              <MyRewards address={address} />
            ) : activeComponent === "Collections" ? (
              <Collections address={address} />
            ) : activeComponent === "Rank" ? (
              <Rank address={address} />
            ) : activeComponent === "Profile" ? (
              <Profile address={address} />
            ) : null}
            <ScanTicketBottomComponent
              showScanTicketComponent={showScanTicketComponent}
              setShowScanTicketComponent={setShowScanTicketComponent}
              setExtraComponent={setExtraComponent}
              address={address}
            />
            <MobileFooter
              setActiveComponent={setActiveComponent}
              activeComponent={activeComponent}
              setShowScanTicketComponent={setShowScanTicketComponent}
              address={address}
            />
          </div>
          {extraComponent && (
            <ExtraParentComponent
              setExtraComponent={setExtraComponent}
              extraComponent={extraComponent}
              address={address}
            />
          )}
        </>
      ) : (
        <div className="app-not-compatible">
          <p>
            This app is not compatible with large screens. Please use it on a
            mobile or small screen.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
