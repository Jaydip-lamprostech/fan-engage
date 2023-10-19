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

// The signIn() method will return the user's Ethereum address
// The await will last until the user is authenticated, so while the UI modal is showed

function App() {
  const [safeInstance, setSafeInstance] = useState();

  const [activeComponent, setActiveComponent] = useState("My Rewards");
  const authKitSignData = async () => {
    try {
      const userData = await safeInstance.signIn();
      console.log(userData);
    } catch (err) {
      console.log(err);
    }
  };
  const signOut = async () => {
    await safeInstance.signOut();
  };
  useEffect(() => {
    const initializeSafe = async () => {
      // https://web3auth.io/docs/sdk/pnp/web/modal/initialize#arguments
      const options = {
        clientId:
          "BHL2WcKZEzJak3aH-af8pbC6Th5wmiWZc_8MrdVsks_JvES1ZZHXVBUd43ujlqcLky-xiRjCxJ7_uYFwrEjsVAM", // https://dashboard.web3auth.io/
        web3AuthNetwork: "testnet",
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0x13881",
          // https://chainlist.org/
          rpcTarget: `https://rpc.ankr.com/polygon_mumbai`,
        },
        uiConfig: {
          theme: "dark",
          loginMethodsOrder: ["google", "facebook"],
        },
      };

      // https://web3auth.io/docs/sdk/pnp/web/modal/initialize#configuring-adapters
      const modalConfig = {
        [WALLET_ADAPTERS.TORUS_EVM]: {
          label: "torus",
          showOnModal: false,
        },
        [WALLET_ADAPTERS.METAMASK]: {
          label: "metamask",
          showOnDesktop: true,
          showOnMobile: true,
        },
      };

      // https://web3auth.io/docs/sdk/pnp/web/modal/whitelabel#whitelabeling-while-modal-initialization
      const openloginAdapter = new OpenloginAdapter({
        loginSettings: {
          mfaLevel: "mandatory",
        },
        adapterSettings: {
          uxMode: "popup",
          whiteLabel: {
            name: "Safe",
          },
        },
        env: "staging",
      });

      const web3AuthConfig = {
        txServiceUrl: "https://mumbaifaucet.com/",
      };

      // Instantiate and initialize the pack
      const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig);
      await web3AuthModalPack.init({
        options,
        adapters: [openloginAdapter],
        modalConfig,
      });
      setSafeInstance(web3AuthModalPack);
    };
    initializeSafe();
  }, []);

  return (
    <div className="App">
      <MobileHeader component={activeComponent} />
      {/* <div>
        <button onClick={authKitSignData}>Login</button>
      </div>
      <div>
        <button onClick={signOut}>Sign Out</button>
      </div> */}
      {activeComponent === "My Rewards" ? (
        <MyRewards />
      ) : activeComponent === "Collections" ? (
        <Collections />
      ) : activeComponent === "Rank" ? (
        <Rank />
      ) : activeComponent === "Profile" ? (
        <Profile />
      ) : null}
      <MobileFooter
        setActiveComponent={setActiveComponent}
        activeComponent={activeComponent}
      />
    </div>
  );
}

export default App;
