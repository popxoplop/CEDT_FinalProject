// server.js
import express from "express";
import fetch from "node-fetch";
import 'dotenv/config'

import cors from "cors"; // <-- add this line

import "./config/db.js"

import app from "./app.js";


const port = 3001;
app.listen(port, () => console.log("Server running on http://localhost:3001"));

