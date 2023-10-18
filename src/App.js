import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Web3AuthModalPack, Web3AuthConfig } from "@safe-global/auth-kit";
import { Web3AuthOptions } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";

// The signIn() method will return the user's Ethereum address
// The await will last until the user is authenticated, so while the UI modal is showed

function App() {
  const [safeInstance, setSafeInstance] = useState();
  const authKitSignData = async () => {
    try {
      const userData = await safeInstance.signIn();
      console.log(userData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const initializeSafe = async () => {
      // https://web3auth.io/docs/sdk/pnp/web/modal/initialize#arguments
      const options = {
        clientId: "YOUR_WEB3_AUTH_CLIENT_ID", // https://dashboard.web3auth.io/
        web3AuthNetwork: "testnet",
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0x5",
          // https://chainlist.org/
          rpcTarget: "https://rpc.ankr.com/eth_goerli",
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
          showOnMobile: false,
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
      });

      const web3AuthConfig = {
        txServiceUrl: "https://safe-transaction-goerli.safe.global",
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
      <header className="App-header">
        <button onClick={authKitSignData}>Login</button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
