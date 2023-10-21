import React, { useState } from "react";
import { Database } from "@tableland/sdk";
import { Wallet, getDefaultProvider } from "ethers";

function App() {
  const [tableName, setTableName] = useState("");
  const privateKey =
    "c61829f03ee914ab79f60b4ce481006b6142af4c862324dee4bbaafb07bdc992";
  const wallet = new Wallet(privateKey);
  const provider = getDefaultProvider(
    "https://polygon-mumbai.g.alchemy.com/v2/NeTaVDMNuGBLmW387WgXEvHrnLxRURwE"
  );

  const signer = wallet.connect(provider);
  // Connect to the database
  const db = new Database({ signer });

  const prefix = "artist_data"; // Your custom table prefix

  const createTable = async () => {
    console.log("Creating table...");
    const { meta: create } = await db
      .prepare(
        `CREATE TABLE ${prefix} (id integer primary key, eoa text, event_name text, event_venue text, pass_image text, pass_count integer , collection_name text );`
      )
      .run();

    // The table's `name` is in the format `{prefix}_{chainId}_{tableId}`
    console.log("Table created:", create.txn.name);
    // tableName = create.txn.name;
    setTableName(create.txn.name);
    console.log(tableName);
  };

  const instertTable = async () => {
    console.log("inserting...");

    if (!tableName) {
      setTableName("artist_data_80001_7819");
    }
    console.log(tableName);

    // Insert a row into the table

    const { meta: insert } = await db
      .prepare(
        `INSERT INTO ${tableName} (eoa, event_name, event_venue, pass_image, pass_count, collection_name ) VALUES (?, ?, ? ,?, ?, ?);`
      )

      .bind(
        "6679e259bbe30e2e50adb35882d87cae42612237d64f4bdd3bc52b1078cae77",
        "Lollapalooza",
        "Chicago",
        "pass_image_1",
        "28000",
        "Collection_1"
      )
      .run();

    // Wait for the insert operation to complete
    // await insert;

    console.log("inserted...");

    // Perform a read query, requesting all rows from the table
    console.log("reading");
    const { results } = await db.prepare(`SELECT * FROM ${tableName};`).all();
    console.table(results);
  };

  const ReadTable = async () => {
    console.log("reading...");
    if (!tableName) {
      setTableName("my_demo_tables_80001_7819");
    }
    const { results } = await db.prepare(`SELECT * FROM ${tableName};`).all();
    console.table(results);
  };

  return (
    <div>
      <h1>Hello From tableland</h1>
      <button onClick={() => createTable()}>Create Table</button>
      <button onClick={() => ReadTable()}>Read Table</button>
      <button onClick={() => instertTable()}>insert Table</button>
    </div>
  );
}

export default App;
