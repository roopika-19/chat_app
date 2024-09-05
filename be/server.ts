import express, { Request, Response } from "express";import connectDB from "./config/db";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";
import cors from "cors";
import messageRoutes from "./routes/messageRoutes";
import { Server, Socket } from "socket.io";


dotenv.config();
connectDB();
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());


app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

const socketToUserMap: Record<string, string> = {};

io.on("connection", (socket: Socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData: { _id: string }) => {
    socketToUserMap[socket.id] = userData?._id;
    socket.join(userData?._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room: string) => {
    socket.join(room);
    console.log("User Joined Room: " + room);

    // Get the list of socket IDs in the room
    const roomSockets = io.sockets.adapter.rooms.get(room);

    if (roomSockets) {
      // Convert the Set of socket IDs to an array
      const socketIds = Array.from(roomSockets);
      console.log("Users in Room: ", socketIds);
    } else {
      console.log("No users in room or room does not exist.");
    }
  });

  socket.on("typing", (room: string) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room: string) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived: {
    chat: { users: { _id: string }[] };
    sender: { _id: string };
  }) => {
    const chat = newMessageReceived.chat;

    console.log("****** ", chat);

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message_received", newMessageReceived);
    });
  });

  socket.on("start call", async (room: { to: string; from: string; channel: string }) => {
    socket.in(room.from).emit("incoming call", room.channel);
    console.log(`Call initiated in room ${room.to}`);
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
    const userId = socketToUserMap[socket.id];
    if (userId) {
      console.log(`User ${userId} has disconnected.`);
      delete socketToUserMap[socket.id];
    }
  });
});
