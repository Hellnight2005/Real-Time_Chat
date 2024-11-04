const express = require("express");
const connectdb = require("./config/db.js")
const app = express();
connectDB();
const { chatData } = require("./chat");
app.get("/api/chat", (req, res) => {
  res.send(chatData);
});

app.listen(5000, console.log("Server at 5000"));
