"use strict";

const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

// Database
const db = new sqlite3.Database("./trinkspruch.sqlite", err => {
  if (err) {
    return console.error(err);
  }
  console.log("E Datebankverbindig isch hergstellt worde.")
});
db.run("CREATE TABLE IF NOT EXISTS toasts(id INTEGER PRIMARY KEY AUTOINCREMENT, toast TEXT, votes INTEGER DEFAULT 0)")

// Constants
const PORT = 8080;
const HOST = "0.0.0.0";

// Logic
const getToast = res => {
  const sql = "SELECT DISTINCT toast, votes FROM toasts";
  db.all(sql, [], (err, rows) => {
    let toast = "Leider kein Spruch für dich gfunde ¯\_(ツ)_/¯"
    
    if (err) {
      console.error(err);
    } else {
      if (rows.length > 0) {
        let result = rows[Math.round(Math.random() * (rows.length-1))];
        toast = result.toast;
      }
    }

    res.render("index", {toast: toast});
  });
  
}

const addToast = toast => {
  const sql = "INSERT INTO toasts(toast) VALUES (?)";
  db.run(sql, toast, err => {
    if(err) {
      return console.error(err);
    }
  });
}

// App
const app = express();

app.use(express.static(__dirname + "/assets"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "pug");

app.post("/add", (req, res) => {
  const toast = req.body.toast;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`En neue Trinkspruch "${toast}" vom "${ip}" wird ufgnoh.`)
  addToast(toast);
  res.render("index", {toast: toast});
});

app.get("*", (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`En Trinkspruch für de ${ip} wird gsuecht.`)
  getToast(res);
});

app.listen(PORT, HOST);
console.log("Trinksprüch werded ab ez bereitgstellt.");
