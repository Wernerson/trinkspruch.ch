'use strict';

const express = require('express');
const fs = require("fs");

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const getToast = () => {
  const toasts = JSON.parse(fs.readFileSync("./toasts.json", "utf8"));
  return toasts[Math.round(Math.random() * toasts.length)]
}

// App
const app = express();
app.get('/', (req, res) => {
  res.send(getToast());
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
