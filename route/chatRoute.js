// backend/route/chatRoute.js

const { Router } = require("express");
const router = Router();
const { handleWebSocketConnection } = require("../logic/chat_controller");

const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 6060 });

wss.on("connection", handleWebSocketConnection);

router.get("/", (req, res) => {
  res.send("WebSocket server for chat is running");
});

module.exports = router;
