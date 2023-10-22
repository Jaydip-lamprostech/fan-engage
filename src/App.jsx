import React, { useState } from "react";
import { Database } from "@tableland/sdk";
import { Wallet, getDefaultProvider } from "ethers";
import "./App.css";

function App() {
  const privateKey = import.meta.env.VITE_PRIVATE_KEY;
  const wallet = new Wallet(privateKey);
  const provider = getDefaultProvider(
    "https://polygon-mumbai.g.alchemy.com/v2/NeTaVDMNuGBLmW387WgXEvHrnLxRURwE"
  );

  const signer = wallet.connect(provider);
  // Connect to the database
  const db = new Database({ signer });

  const FanPrefix = "Fantable_80001_8169";
  const ArtistPrefix = "Artisttable_80001_8168";

  const createArtistTable = async () => {
    console.log("Creating table...");
    const { meta: create } = await db
      .prepare(
        `CREATE TABLE ${ArtistPrefix} (id integer primary key, eoa text, event_name text, event_venue text, pass_image text, pass_count text, collection_name text);`
      )
      .run();

    console.log("Table created:", create.txn.name);
  };

  const createFanTable = async () => {
    console.log("Creating table...");
    const { meta: create } = await db
      .prepare(
        `CREATE TABLE ${FanPrefix} (id integer primary key, eoa text, event_name text, event_venue text, scanned_image text, rewards text, collection_name text);`
      )
      .run();

    console.log("Table created:", create.txn.name);
  };

  const insertFanTable = async () => {
    console.log("Inserting...");

    // Insert a row into the table
    const { meta: insert } = await db
      .prepare(
        `INSERT INTO ${FanPrefix} (eoa, event_name, event_venue, scanned_image, rewards, collection_name) VALUES (?, ?, ?, ?, ?, ?);`
      )
      .bind(
        "0xB5204aff106dc1Ffc6bE909c94a6A933081dB636",
        "La_tomatina with indian test",
        "FUN BLAST, SBR road , Ahmedabad 380054,",
        "https://images.squarespace-cdn.com/content/v1/58eb4273c534a5cb83c85625/1529762397780-L4B62P4PX6BA45AE8OKX/Tomatina+4.jpg?format=1500w",
        "$10000",
        "collection-1"
      )
      .run();

    console.log("Inserted...");
  };

  const insertArtistTable = async () => {
    console.log("Inserting...");

    // Insert a row into the table
    const { meta: insert } = await db
      .prepare(
        `INSERT INTO ${ArtistPrefix} (eoa, event_name, event_venue, pass_image, pass_count, collection_name) VALUES (?, ?, ?, ?, ?, ?);`
      )
      .bind(
        "0xB5204aff106dc1Ffc6bE909c94a6A933081dB636",
        "La_tomatina with indian test from Artist",
        "Sarojini nagar, Delhi,",
        "https://images.squarespace-cdn.com/content/v1/58eb4273c534a5cb83c85625/1529762397780-L4B62P4PX6BA45AE8OKX/Tomatina+4.jpg?format=1500w",
        "10000",
        "collection-1"
      )
      .run();

    console.log("Inserted...");
  };
  const readArtistTable = async () => {
    console.log("Reading Artist Data...");
    const { results } = await db
      .prepare(`SELECT * FROM ${ArtistPrefix};`)
      .all();
    console.table(results);
  };

  const readFanTable = async () => {
    console.log("Reading Fan Data...");
    const { results } = await db.prepare(`SELECT * FROM ${FanPrefix}`).all();
    console.table(results);
  };

  return (
    <div>
      <h1>Hello From tableland</h1>
      <button onClick={() => createArtistTable()}>Create Artist Table</button>
      <button onClick={() => createFanTable()}>Create Fan Table </button>
      <button onClick={() => insertArtistTable()}>Insert Artist Table </button>

      <button onClick={() => insertFanTable()}>Insert fan Table </button>
      <button onClick={() => readFanTable()}>read fan Table </button>

      <button onClick={() => readArtistTable()}>read Artist Table </button>
    </div>
  );
}

export default App;
