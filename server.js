const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

const DB_FILE = "./database.json";

// Load database
function loadDB() {
  if (!fs.existsSync(DB_FILE)) return {};
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

// Save database
function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// Register UID
app.post("/register", (req, res) => {
  const { uid } = req.body;
  if (!uid) return res.json({ success: false, error: "UID missing" });

  const db = loadDB();
  const expires = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
  db[uid] = { active: true, expires };
  saveDB(db);

  res.json({ success: true, expires });
});

// Proxy endpoint
app.get("/proxy/:uid", (req, res) => {
  const uid = req.params.uid;
  const db = loadDB();

  if (!db[uid] || !db[uid].active) {
    return res.status(403).json({
      error: `fail to connect, UID=[${uid}] is locked, pls unlock UID`,
    });
  }

  // Expired session check
  if (Date.now() > db[uid].expires) {
    db[uid].active = false;
    saveDB(db);
    return res
      .status(403)
      .json({ error: `Session expired. UID=[${uid}] is now locked.` });
  }

  // Fake VIP data
  res.json({
    skins: "all unlocked",
    diamonds: 999999,
    gold: 999999,
    emotes: "all unlocked",
    v_badge: true,
    mailbox: "full",
  });
});

// Test route
app.get("/ping", (req, res) => {
  res.json({ msg: "pong" });
});

app.listen(PORT, () => {
  console.log(`VIP Proxy backend running on port ${PORT}`);
});
