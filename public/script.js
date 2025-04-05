var socket = io();

var serverId = document.getElementById("server-id");
var historyContainer = document.getElementById("messages");
var newMessage = document.getElementById("message");
var roomInput = document.getElementById("room");
var sendBtn = document.getElementById("send-btn");
var joinBtn = document.getElementById("join-btn");
var leaveBtn = document.getElementById("leave-btn");
var roomNameDesc = document.getElementById("room-name");
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
  messageElement.innerHTML = message;

  historyContainer.appendChild(messageElement);
}

function submitMessage(e) {
  e.preventDefault();
  if (newMessage.value.trim() === "") return;

  addNewMessage(newMessage.value);

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
    roomNameDesc.textContent = `Current Room: ${roomName}`;
    addNewMessage(`Joined room: ${roomName}`);
    roomInput.value = "";
  });
}

function leaveRoom(e) {
  e.preventDefault();
  socket.emit("leave-room", room, () => {
    addNewMessage("Left room: " + room);
    room = null;
    roomNameDesc.textContent = ``;
  });
}

socket.on("connect", function () {
  console.log(" user connected to server with id: ", socket.id);
  serverId.textContent = `You are connected to server with id: ${socket.id}`;
});

socket.on("new-message", addNewMessage);
