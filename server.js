"use strict";

const express = require("express");
const fs = require("fs");

// Constants
const PORT = 8080;
const HOST = "0.0.0.0";

const getToast = () => {
  const toasts = JSON.parse(fs.readFileSync("./toasts.json", "utf8"));
  const index = Math.round(Math.random() * (toasts.length-1));
  return toasts[index];
}

// App
const app = express();

app.use(express.static(__dirname + "/assets"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index", {toast: getToast()});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
