import React, { useEffect, useState } from "react";
import "../styles/AddEvent.css";
import { getDefaultProvider, Wallet } from "ethers";
import { Web3Storage } from "web3.storage";
import { GelatoRelayPack } from "@safe-global/relay-kit";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import {
  MetaTransactionData,
  MetaTransactionOptions,
} from "@safe-global/safe-core-sdk-types";
import { Database } from "@tableland/sdk";
import dotenv from "dotenv";

const API_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGZiNzE4QzgwYmJlYUQwNTAzYThFMjgzMmI2MDU0RkVmOUU4MzA2NzQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjE0MTEzNjczNTAsIm5hbWUiOiJUcnkifQ.srPPE7JD3gn8xEBCgQQs_8wyo6rDrXaDWC0QM8FtChA";

const client = new Web3Storage({ token: API_TOKEN });

function AddEvent(props) {
  console.log(props.address);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [safeAddress, setSafeAddress] = useState();

  const [formData, setFormData] = useState({
    eoa: "",
    event_name: "",
    event_venue: "",
    pass_image: "",
    pass_count: 1,
    collection_name: "",
    nft_in_collection: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // handle event ticket image upload
  async function uploadImage(e) {
    // console.log(e.target.value);
    setFileName(document.getElementById("ticket").files[0].name);
    console.log(URL.createObjectURL(e.target.files[0]));
    setFile(URL.createObjectURL(e.target.files[0]));
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const src = e.target.result;
        props.setTicketWithoutQR(src);
      };

      reader.readAsDataURL(file);
    }
  }

  async function handleUpload() {
    setLoading(true);
    var fileInput = document.getElementById("ticket");

    let cid;

    cid = await client.put(fileInput.files);

    console.log(cid);

    let image_cid;

    image_cid = cid + "/" + fileName;

    console.log(image_cid);
    setFormData({ ...formData, pass_image: image_cid });

    handleSubmit();
    // setFile(url);
  }

  // contract integration
  const handleSubmit = async () => {
    console.log(formData.pass_image);
    // Use formData to submit or process the form data
    const url = "https://ipfs.io/ipfs/" + formData.pass_image;
    console.log(url);
    console.log(formData);
    const privateKey = process.env.REACT_APP_PRIVATE_KEY;
    const wallet = new Wallet(privateKey);
    const provider = getDefaultProvider(
      "https://polygon-mumbai.g.alchemy.com/v2/NeTaVDMNuGBLmW387WgXEvHrnLxRURwE"
    );
    const signer = wallet.connect(provider);
    // Connect to the database
    const db = new Database({ signer });

    const FanPrefix = "fantable_80001_8172";
    const ArtistPrefix = "artisttable_80001_8171";

    console.log("Inserting...");

    // Insert a row into the table
    const { meta: insert } = await db
      .prepare(
        `INSERT INTO ${ArtistPrefix} (eoa, event_name, event_venue, pass_image, pass_count, collection_name) VALUES (?, ?, ?, ?, ?, ?);`
      )
      .bind(
        props.address.eoa,
        formData.event_name,
        formData.event_venue,
        url,
        formData.pass_count,
        formData.collection_name
      )
      .run();

    console.log("Inserted...");

    //
    // const RPC_URL =
    //   "https://polygon-mumbai.g.alchemy.com/v2/q5nyl5T11-vTcF_ZRTvjvIoM1q1lEWqk";
    // const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    // const signer = new ethers.Wallet(
    //   process.env.REACT_APP_GELATO_RELAY_API_KEY,
    //   provider
    // );
    // const safeAddress = "0x5aa1DE55561f3b4d4139A7E2079c6dd3CB3894c4"; // Safe from which the transaction will be sent. Replace with your Safe address
    // const chainId = 80001;

    // // Get Gelato Relay API Key: https://relay.gelato.network/
    // const GELATO_RELAY_API_KEY = process.env.REACT_APP_PRIVATE_KEY;

    // const options = {
    //   gasLimit: 100000,
    //   isSponsored: true,
    // };

    // const ethAdapter = new EthersAdapter({
    //   ethers,
    //   signerOrProvider: signer,
    // });

    // const safeSDK = await Safe.create({
    //   ethAdapter,
    //   safeAddress,
    // });

    // const relayKit = new GelatoRelayPack(GELATO_RELAY_API_KEY);
  };

  // const createSafe = async () => {
  //   console.log("inside");
  //   const RPC_URL =
  //     "https://polygon-mumbai.g.alchemy.com/v2/q5nyl5T11-vTcF_ZRTvjvIoM1q1lEWqk";
  //   const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  //   const signer = new ethers.Wallet(
  //     "0x3e4fb39c0becc66f4c79867213e2c395e6303841d10f9baa69ee3fba81e32b08",
  //     provider
  //   );
  //   // const provider = new ethers.providers.Web3Provider(
  //   //   props.modalPack.getProvider()
  //   // );
  //   // const signer = provider.getSigner();
  //   // ethAdapter instance
  //   const ethAdapter = new EthersAdapter({
  //     ethers,
  //     signerOrProvider: signer,
  //   });
  //   console.log(ethAdapter);

  //   // deploy a new safe
  //   const safeFactory = await SafeFactory.create({ ethAdapter });
  //   console.log(safeFactory);
  //   const owners = [props.address.eoa];
  //   const threshold = 1;
  //   const safeAccountConfig = {
  //     owners: owners,
  //     threshold: threshold,
  //     saltNonce: 123,
  //   };
  //   console.log(owners);
  //   const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });
  //   console.log(safeSdk);

  //   // //
  //   const newSafeAddress = await safeSdk.getAddress();
  //   console.log(newSafeAddress);

  //   // safe account : 0x5aa1DE55561f3b4d4139A7E2079c6dd3CB3894c4
  // };

  // useEffect(() => {
  //   if (props.address) {
  //     if (props.address.safes.length == 0) {
  //       createSafe();
  //     } else {
  //       setSafeAddress(props.address.safes[0]);
  //     }
  //   }
  // }, []);
  return (
    <div className="add-event-main">
      <h1>Add Your Event on This Platform</h1>
      <div className="input-parent">
        <label>Event Name</label>
        <input
          type="text"
          name="event_name"
          required
          value={formData.event_name}
          onChange={handleChange}
        />
      </div>
      <div className="input-parent">
        <label>Event Venue</label>
        <textarea
          type="text"
          required
          rows={10}
          name="event_venue"
          value={formData.event_venue}
          onChange={handleChange}
        />
      </div>
      <div className="input-parent">
        <label>Ticket Count</label>
        <input
          type="text"
          required
          name="pass_count"
          disabled
          value={formData.pass_count}
          onChange={handleChange}
        />
      </div>

      <div className="input-parent">
        <label>NFT Collection Name</label>
        <input
          type="text"
          required
          name="collection_name"
          value={formData.collection_name}
          onChange={handleChange}
        />
      </div>
      <div className="input-parent">
        <label>Event Ticket Image</label>
        <input
          type="file"
          required
          id="ticket"
          name="collection_name"
          onChange={uploadImage}
        />
      </div>
      <div className="input-parent">
        <button className="submit" onClick={handleUpload}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default AddEvent;
