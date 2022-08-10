//library
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const socketio = require("socket.io");
const http = require("http");
const { addUser, removeUser, getUser, getRoomUsers } = require("./entity");

// Instances
const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "*" } });

//Middleware
app.use(express.json());
app.use(morgan('tiny'));

//Cors
const corsOptions = {origin: "*",credentials: true,  optionSuccessStatus: 200,};
//access-control-allow-credentials:true
app.use(cors(corsOptions)); // Use this after the variable declaration


// DB Connection
const connection = require("./DB/mongoose");

//router
const router = require("./Routes/Router1");
app.use("/", router);

// End point
app.get("/", (req, res) => {
  res.json("Api is working");
});

//socket

io.on("connect", (socket) => {
  socket.on("join", ({ user, room }, callback) => {
    console.log(user, room);
    const { response, error } = addUser({
      id: socket.id,
      user: user,
      room: room,
    });

    console.log(response);

    if (error) {
      callback(error);
      return;
    }
    socket.join(response.room);
    socket.emit("message", {
      user: "admin",
      text: `Welcome ${response.user} `,
    });
    socket.broadcast
      .to(response.room)
      .emit("message", { user: "admin", text: `${response.user} has joined` });

    io.to(response.room).emit("roomMembers", getRoomUsers(response.room));
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.user, text: message });

    callback();
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.user} has left`,
      });
    }
  });
});

const port=process.env.PORT || "8000"

server.listen(port, () => console.log("server running....."));
