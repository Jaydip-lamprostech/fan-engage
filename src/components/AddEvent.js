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
import completeIcon from "../assets/complete.png";

const API_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGZiNzE4QzgwYmJlYUQwNTAzYThFMjgzMmI2MDU0RkVmOUU4MzA2NzQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjE0MTEzNjczNTAsIm5hbWUiOiJUcnkifQ.srPPE7JD3gn8xEBCgQQs_8wyo6rDrXaDWC0QM8FtChA";

const client = new Web3Storage({ token: API_TOKEN });

function AddEvent(props) {
  console.log(props.address);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");

  const [showProcessMsg, setShowProcessMsg] = useState(false);
  const [processMsg1, setProcessMsg1] = useState({
    msg: "Uploading the ticket on IPFS storage",
    status: false,
  });
  const [processMsg2, setProcessMsg2] = useState({
    msg: "Inserting the data on Tableland database",
    status: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    props.setFormData({
      ...props.formData,
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
    setShowProcessMsg(true);
    setProcessMsg2({ ...processMsg2, status: false });
    setProcessMsg1({ ...processMsg1, status: false });
    setLoading(true);
    var fileInput = document.getElementById("ticket");

    let cid;

    cid = await client.put(fileInput.files);

    console.log(cid);

    let image_cid;

    image_cid = cid + "/" + fileName;

    console.log(image_cid);

    setProcessMsg1({ ...processMsg1, status: true });
    handleSubmit(image_cid);
    // setFile(url);
  }

  // contract integration
  const handleSubmit = async (image_cid) => {
    console.log(image_cid);

    // Use formData to submit or process the form data
    const url = "https://ipfs.io/ipfs/" + image_cid;
    console.log(url);

    console.log(props.formData);
    const privateKey = process.env.REACT_APP_PRIVATE_KEY;
    const wallet = new Wallet(privateKey);
    const provider = getDefaultProvider(
      "https://polygon-mumbai.g.alchemy.com/v2/NeTaVDMNuGBLmW387WgXEvHrnLxRURwE"
    );
    const signer = wallet.connect(provider);
    // Connect to the database
    const db = new Database({ signer });

    const ArtistPrefix = "artisttabledata_80001_8209";

    console.log("Inserting...");

    // // Insert a row into the table
    const { meta: insert } = await db
      .prepare(
        `INSERT INTO ${ArtistPrefix} (eoa, event_name, event_venue, pass_image, pass_count, collection_name) VALUES (?, ?, ?, ?, ?, ?);`
      )
      .bind(
        props.address.eoa,
        props.formData.event_name,
        props.formData.event_venue,
        url,
        props.formData.pass_count,
        props.formData.collection_name
      )
      .run();

    console.log("Inserted...");

    const { results } = await db
      .prepare(`SELECT * FROM ${ArtistPrefix};`)
      .all();
    console.table(results);

    const event_id = results.length;

    console.log(event_id);

    props.setFormData({
      ...props.formData,
      event_id: event_id,
      pass_image: url,
    });
    setProcessMsg2({ ...processMsg2, status: true });
    props.setShowTicketWithQR(true);
  };

  return (
    <div className="add-event-main">
      <h1>Add Your Event on This Platform</h1>
      <div className="input-parent">
        <label>Event Name</label>
        <input
          type="text"
          name="event_name"
          required
          value={props.formData.event_name}
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
          value={props.formData.event_venue}
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
          value={props.formData.pass_count}
          onChange={handleChange}
        />
      </div>

      <div className="input-parent">
        <label>NFT Collection Name</label>
        <input
          type="text"
          required
          name="collection_name"
          value={props.formData.collection_name}
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
        {showProcessMsg ? (
          <>
            <label>Please wait while the process completes...</label>
            <div className="process-div">
              {!processMsg1.status ? (
                <svg
                  width="30px"
                  height="30px"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid"
                  className="loading-svg"
                >
                  <g transform="rotate(0 50 50)">
                    <rect
                      x="47"
                      y="24"
                      rx="3"
                      ry="6"
                      width="6"
                      height="12"
                      fill="#ffffff"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="1s"
                        begin="-0.9166666666666666s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(30 50 50)">
                    <rect
                      x="47"
                      y="24"
                      rx="3"
                      ry="6"
                      width="6"
                      height="12"
                      fill="#ffffff"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="1s"
                        begin="-0.8333333333333334s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(60 50 50)">
                    <rect
                      x="47"
                      y="24"
                      rx="3"
                      ry="6"
                      width="6"
                      height="12"
                      fill="#ffffff"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="1s"
                        begin="-0.75s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(90 50 50)">
                    <rect
                      x="47"
                      y="24"
                      rx="3"
                      ry="6"
                      width="6"
                      height="12"
                      fill="#ffffff"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="1s"
                        begin="-0.6666666666666666s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(120 50 50)">
                    <rect
                      x="47"
                      y="24"
                      rx="3"
                      ry="6"
                      width="6"
                      height="12"
                      fill="#ffffff"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="1s"
                        begin="-0.5833333333333334s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(150 50 50)">
                    <rect
                      x="47"
                      y="24"
                      rx="3"
                      ry="6"
                      width="6"
                      height="12"
                      fill="#ffffff"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="1s"
                        begin="-0.5s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(180 50 50)">
                    <rect
                      x="47"
                      y="24"
                      rx="3"
                      ry="6"
                      width="6"
                      height="12"
                      fill="#ffffff"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="1s"
                        begin="-0.4166666666666667s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(210 50 50)">
                    <rect
                      x="47"
                      y="24"
                      rx="3"
                      ry="6"
                      width="6"
                      height="12"
                      fill="#ffffff"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="1s"
                        begin="-0.3333333333333333s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(240 50 50)">
                    <rect
                      x="47"
                      y="24"
                      rx="3"
                      ry="6"
                      width="6"
                      height="12"
                      fill="#ffffff"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="1s"
                        begin="-0.25s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(270 50 50)">
                    <rect
                      x="47"
                      y="24"
                      rx="3"
                      ry="6"
                      width="6"
                      height="12"
                      fill="#ffffff"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="1s"
                        begin="-0.16666666666666666s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(300 50 50)">
                    <rect
                      x="47"
                      y="24"
                      rx="3"
                      ry="6"
                      width="6"
                      height="12"
                      fill="#ffffff"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="1s"
                        begin="-0.08333333333333333s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(330 50 50)">
                    <rect
                      x="47"
                      y="24"
                      rx="3"
                      ry="6"
                      width="6"
                      height="12"
                      fill="#ffffff"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="1s"
                        begin="0s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                </svg>
              ) : (
                <img src={completeIcon} alt="complete process" />
              )}
              <span>{processMsg1.msg}</span>
            </div>
            <div className="process-div">
              {!processMsg2.status ? (
                <svg
                  width="30px"
                  height="30px"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid"
                  className="loading-svg"
                >
                  <g transform="rotate(0 50 50)">
                    <rect
                      x="47"
                      y="24"
                      rx="3"
                      ry="6"
                      width="6"
                      height="12"
                      fill="#ffffff"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="1s"
                        begin="-0.9166666666666666s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(30 50 50)">
                    <rect
                      x="47"
                      y="24"
                      rx="3"
                      ry="6"
                      width="6"
                      height="12"
                      fill="#ffffff"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="1s"
                        begin="-0.8333333333333334s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(60 50 50)">
                    <rect
                      x="47"
                      y="24"
                      rx="3"
                      ry="6"
                      width="6"
                      height="12"
                      fill="#ffffff"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="1s"
                        begin="-0.75s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(90 50 50)">
                    <rect
                      x="47"
                      y="24"
                      rx="3"
                      ry="6"
                      width="6"
                      height="12"
                      fill="#ffffff"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="1s"
                        begin="-0.6666666666666666s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(120 50 50)">
                    <rect
                      x="47"
                      y="24"
                      rx="3"
                      ry="6"
                      width="6"
                      height="12"
                      fill="#ffffff"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="1s"
                        begin="-0.5833333333333334s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(150 50 50)">
                    <rect
                      x="47"
                      y="24"
                      rx="3"
                      ry="6"
                      width="6"
                      height="12"
                      fill="#ffffff"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="1s"
                        begin="-0.5s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(180 50 50)">
                    <rect
                      x="47"
                      y="24"
                      rx="3"
                      ry="6"
                      width="6"
                      height="12"
                      fill="#ffffff"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="1s"
                        begin="-0.4166666666666667s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(210 50 50)">
                    <rect
                      x="47"
                      y="24"
                      rx="3"
                      ry="6"
                      width="6"
                      height="12"
                      fill="#ffffff"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="1s"
                        begin="-0.3333333333333333s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(240 50 50)">
                    <rect
                      x="47"
                      y="24"
                      rx="3"
                      ry="6"
                      width="6"
                      height="12"
                      fill="#ffffff"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="1s"
                        begin="-0.25s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(270 50 50)">
                    <rect
                      x="47"
                      y="24"
                      rx="3"
                      ry="6"
                      width="6"
                      height="12"
                      fill="#ffffff"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="1s"
                        begin="-0.16666666666666666s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(300 50 50)">
                    <rect
                      x="47"
                      y="24"
                      rx="3"
                      ry="6"
                      width="6"
                      height="12"
                      fill="#ffffff"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="1s"
                        begin="-0.08333333333333333s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(330 50 50)">
                    <rect
                      x="47"
                      y="24"
                      rx="3"
                      ry="6"
                      width="6"
                      height="12"
                      fill="#ffffff"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="1s"
                        begin="0s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                </svg>
              ) : (
                <img src={completeIcon} alt="complete process" />
              )}
              <span>{processMsg2.msg}</span>
            </div>
          </>
        ) : null}
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
