// server.js
import express from "express";
import fetch from "node-fetch";
import 'dotenv/config'

import cors from "cors"; // <-- add this line

import "./config/db.js"

import app from "./app.js";


const PORT = 3222;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend Server ready at http://localhost:${PORT}`);
});

