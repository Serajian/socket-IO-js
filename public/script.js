var socket = io();
// var dashboardSocket = io("http://localhost:3003/dashboard", {
//   //   auth: { token: "123" },
// });
var serverId = document.getElementById("server-id");
var historyContainer = document.getElementById("messages");
var newMessage = document.getElementById("message");
var roomInput = document.getElementById("room");
var sendBtn = document.getElementById("send-btn");
var joinBtn = document.getElementById("join-btn");
var room;

sendBtn.addEventListener("click", submitMessage);
joinBtn.addEventListener("click", joinRoom);
leaveBtn.addEventListener("click", leaveRoom);

const connectToSocket = () => {
  socket.connect();
};
const disconnectFromSocket = () => {
  socket.disconnect();
};

function addNewMessage(message) {
  var messageElement = document.createElement("div");
  messageElement.textContent = message;
  historyContainer.appendChild(messageElement);
}

function submitMessage(e) {
  e.preventDefault();
  if (newMessage.value.trim() === "") return;

  addNewMessage(newMessage.value);
  //   if (newMessage.value.trim() === "d") {
  //     disconnectFromSocket();
  //     addNewMessage("Disconnected from server");
  //     return;
  //   }
  //   if (newMessage.value.trim() === "c") {
  //     connectToSocket();
  //     addNewMessage("Connected to server");
  //   }
  socket.emit("new-message", newMessage.value, room);

  newMessage.value = "";
  newMessage.focus();
}

function joinRoom(e) {
  e.preventDefault();
  const roomName = roomInput.value;
  if (roomName.trim() === "") return;

  socket.emit("join-room", roomName, () => {
    room = roomName;
    addNewMessage(`Joined room: ${roomName}`);
    roomInput.value = "";
  });
}

function leaveRoom(e) {
  e.preventDefault();
  socket.emit("leave-room", room, () => {
    room = null;
    addNewMessage("Left room: " + room);
  });
}
// dashboardSocket.on("connect", function () {
//   console.log("dashboard connected with id: ", dashboardSocket.id);
//   addNewMessage("Dashboard connected to server with id: " + dashboardSocket.id);
// });

// dashboardSocket.on("connect_error", addNewMessage);

socket.on("connect", function () {
  console.log(" user connected to server with id: ", socket.id);
  serverId.textContent = `You are connected to server with id: ${socket.id}`;
});

socket.on("new-message", addNewMessage);
