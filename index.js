const express = require("express");
const app = express();
const { chatData } = require("./chat");
app.get("/api/chat", (req, res) => {
  res.send(chatData);
});

app.listen(5000, console.log("Server at 5000"));
