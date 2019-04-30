"use strict";

const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

// Constants
const PORT = 8080;
const HOST = "0.0.0.0";

const getToast = () => {
  const toasts = JSON.parse(fs.readFileSync("./toasts.json", "utf8"));
  const index = Math.round(Math.random() * (toasts.length-1));
  return toasts[index];
}

const addToast = toast => {
  const toasts = JSON.parse(fs.readFileSync("./toasts.json", "utf8"));
  toasts.push(toast);
  console.log(toasts);
  fs.writeFileSync("./toasts.json", JSON.stringify(toasts));
}

// App
const app = express();

app.use(express.static(__dirname + "/assets"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "pug");

app.post("/add", (req, res) => {
  addToast(req.body.toast);
  res.render("index", {toast: getToast()});
});

app.get("*", (req, res) => {
  res.render("index", {toast: getToast()});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
