const express = require("express");
const http = require("http");
var cors = require("cors");
var mqtt = require("mqtt");
const app = express();

var serverPort = 8282;

var server = http.createServer(app);

//set the template engine ejs

app.use(cors());

//middlewares
app.use(express.static("public"));

//routes
app.get("/", (req, res) => {
  res.type("text/plain");
  res.status(200).send("YOLO");
});

server.listen(serverPort, () => {
  console.log("ssh websocket server started");
});

// mqtt init
const client = mqtt.connect("mqtt://localhost:1883", {
  username: "van",
  password: "123",
});

client.on("connect", function () {
  console.log("MQTT CONNECTION START");
  client.subscribe("monosparta/chat");
});

const io = require("socket.io")(server);

io.on("connection", function (socket) {
  socket.on("disconnect", function () {});
  socket.on("chat", function (msg) {
    client.publish("monosparta/chat", JSON.stringify(msg));
  });

  client.on("message", function (topic, msg) {
    // 以 chat 發送訊息給監聽的 client
    socket.emit("chat", JSON.parse(msg));
  });
  try {
    //
  } catch {
    socket.emit("data", "Node not found.");
  }
});
