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

// The signIn() method will return the user's Ethereum address
// The await will last until the user is authenticated, so while the UI modal is showed

function App() {
  const [safeInstance, setSafeInstance] = useState();
  const [userDetails, setUserDetails] = useState();
  const [activeComponent, setActiveComponent] = useState("My Rewards");
  const authKitSignData = async () => {
    try {
      const userData = await safeInstance.signIn();
      console.log(userData);
      setUserDetails(userData);
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

  // deploy safe
  const deploySafe = async () => {
    try {
      const RPC_URL = "https://rpc.ankr.com/polygon_mumbai";
      const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
      // console.log(provider);
      // const signer = userData.signer;
      // const owner1Signer = new ethers.Wallet(
      //   `${process.env.REACT_APP_IMP_K}`,
      //   provider
      // );
      // console.log(owner1Signer);
      console.log(userDetails.address);
      console.groupEnd(safeInstance.signer);
      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: safeInstance.signer,
      });
      console.log(ethAdapter);

      const safeFactory = await SafeFactory.create({ ethAdapter });
      console.log(safeFactory);

      const owners = [`${userDetails.address.eoa}`];
      const threshold = 1;

      const safeAccountConfig = {
        owners,
        threshold,
        // ...
      };

      const safeSdk = await safeFactory.deploySafe({
        safeAccountConfig,
      });
      console.log(safeSdk);
      const newSafeAddress = await safeSdk.getAddress();
      console.log("Your Safe has been deployed:");
      console.log(`https://goerli.etherscan.io/address/${newSafeAddress}`);
      console.log(`https://app.safe.global/gor:${newSafeAddress}`);
      console.log(newSafeAddress);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <MobileHeader component={activeComponent} />
      <div style={{ marginTop: "100px" }}>
        <button onClick={authKitSignData}>Login</button>
      </div>
      <div>
        <button onClick={signOut}>Sign Out</button>
      </div>
      <div>
        <button onClick={deploySafe}>Deploy Safe</button>
      </div>
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
