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
  const sql = "SELECT DISTINCT id, toast, votes FROM toasts";
  db.all(sql, [], (err, rows) => {
    
    let toast;

    if (err) {
      console.error(err);
    } else {
      if (rows.length > 0) {
        toast = rows[Math.round(Math.random() * (rows.length-1))];
      }
    }

    res.render("index", {toast: toast});
  });
  
}

const getToastById = (id, res) => {
  const sql = "SELECT DISTINCT id, toast, votes FROM toasts WHERE id = ?";
  db.all(sql, [id], (err, rows) => {
    
    let toast;

    if (err) {
      console.error(err);
    } else {
        toast = rows[0];
    }

    res.render("index", {toast: toast});
  });
  
}

const addToast = (toast, res) => {
  const sql = "INSERT INTO toasts(toast) VALUES (?)";
  db.run(sql, toast, function(err){
    if(err) {
      console.error(err);
    }
    toast = {
      toast: toast,
      votes: 0,
      id: this.lastID
    };
    res.render("index", {toast: toast});  
  });
}

const vote = (id, res) => {
  const sql = "UPDATE toasts SET votes = (SELECT votes FROM toasts WHERE id = ?) + 1 WHERE id = ?";
  db.run(sql, [id, id], function(err){
    if(err) {
      console.error(err);
    }
    getToastById(id, res);
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
  console.log(`En neue Trinkspruch "${toast}" vom ${ip} wird id Sammlig ufgnoh.`)
  addToast(toast, res);
});

app.get("/vote/:id", (req, res) => {
  const id = req.params.id;
  vote(id, res);
});

app.get("*", (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`En Trinkspruch für de ${ip} wird gsuecht.`);
  getToast(res);
});

app.listen(PORT, HOST);
console.log("Trinksprüch werded ab ez bereitgstellt.");
