// backend/controller/chatController.js

const WebSocket = require("ws");
const ChatMessage = require("../models/chat_model");
const moment = require("moment");

let webSockets = {}; // userID: WebSocket

function handleWebSocketConnection(ws, req) {
  const userID = req.url.substr(1); // get userID from URL (e.g., ws://127.0.0.1:6060/userid)
  webSockets[userID] = ws; // add new user to the connection list

  console.log(`User ${userID} connected`);

  ws.on("message", async (message) => {
    try {
      const messageString = message.toString('utf-8'); // Convert buffer to string
      console.log(messageString);
      const data = JSON.parse(messageString);

      if (data.auth === "addauthkeyifrequired" && data.cmd === "send") {
        const receiverWs = webSockets[data.receiverId]; // check if receiver is connected

        if (receiverWs) {
          const cdata = JSON.stringify({
            cmd: data.cmd,
            senderId: userID,
            receiverId: data.receiverId,
            msgtext: data.msgtext
          });
          receiverWs.send(cdata); // send message to receiver
          ws.send(JSON.stringify({ cmd: "send", status: "success" }));

          // Save message to database
          const chatMessage = new ChatMessage({
            cmd: data.cmd,
            senderId: userID,
            receiverId: data.receiverId,
            msgtext: data.msgtext,  
            timestamp: moment().format()
          });
          await chatMessage.save();
        } else {
          console.log("No receiver user found.");
          ws.send(JSON.stringify({ cmd: "send", status: "error", error: "No receiver found" }));
        }
      } else {
        console.log("Invalid command or authentication error");
        ws.send(JSON.stringify({ cmd: data.cmd, status: "error", error: "Invalid command or authentication error" }));
      }
    } catch (error) {
      console.log("Error processing message:", error);
      ws.send(JSON.stringify({ cmd: "error", status: "error", error: "Invalid message format" }));
    }
  });

  ws.on("close", () => {
    delete webSockets[userID]; // remove user from connection list on disconnect
    console.log(`User ${userID} disconnected`);
  });

  ws.send(JSON.stringify({ cmd: "connected", status: "success" })); // initial connection message
}

module.exports = { handleWebSocketConnection };
