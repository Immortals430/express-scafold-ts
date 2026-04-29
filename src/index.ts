import express from "express";
import server from "./server.js";

export const app = express();



app.get("/auth", (req, res) => {
  res.json({data: "auth"});
});





server();
