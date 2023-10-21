import React, { useState } from "react";
import "../styles/AddEvent.css";
import { Web3Storage } from "web3.storage";
const API_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGZiNzE4QzgwYmJlYUQwNTAzYThFMjgzMmI2MDU0RkVmOUU4MzA2NzQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjE0MTEzNjczNTAsIm5hbWUiOiJUcnkifQ.srPPE7JD3gn8xEBCgQQs_8wyo6rDrXaDWC0QM8FtChA";

const client = new Web3Storage({ token: API_TOKEN });

function AddEvent(props) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");

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
  const handleSubmit = () => {
    // Use formData to submit or process the form data

    // const url = "https://ipfs.io/ipfs/" + formData.pass_image;
    console.log(formData);
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
