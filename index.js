const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

const app = express();
const httpServer = http.createServer(app);

app.use(express.static(__dirname + "/public"));

const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("connected with id: ", socket.id);
  socket.on("new-message", (message, room) => {
    if (room) {
      socket.to(room).emit("new-message", message);
    } else {
      socket.broadcast.emit("new-message", message);
    }
  });

  socket.on("join-room", (roomName, callback) => {
    socket.join(roomName);
    callback();
  });

  socket.on("leave-room", (roomName, callback) => {
    socket.leave(roomName);
    callback();
  });
});

const port = 3003;
httpServer.listen(port, () => console.log("server is listening on 3003"));
instrument(io, { auth: false });
