import express from "express";
import server from "./server.js";

export const authApp = express();
export const productsApp = express();



authApp.get("/auth", (req, res) => {
  res.json({data: "auth"});
});


productsApp.get("/products", (req, res) => {
  res.json({data: "product"});
});




server();
