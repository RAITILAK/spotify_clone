import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  const userSockets = new Map(); //{userId:socketId}
  const userActivities = new Map(); //{userId:activity}

  // When a client connects to the socket server
  io.on("connection", (socket) => {
    // Listen for 'user_connected' event from the client with their userId
    socket.on("user_connected", (userId) => {
      // Map the userId to the connected socket's ID
      userSockets.set(userId, socket.id);

      // Initialize the user's activity as "Idle"
      userActivities.set(userId, "Idle");

      // Broadcast to all users that this user just connected
      io.emit("user_connected", userId);

      // Send the current list of online users to the newly connected user
      socket.emit("users_online", Array.from(userSockets.keys()));

      // Send the full list of user activities to all clients
      io.emit("activities", Array.from(userActivities.entries()));
    });

    // ✅ Listen for 'update_activity' event sent from client with userId and new activity
    socket.on("update_activity", ({ userId, activity }) => {
      console.log("activity updated", userId, activity);

      // Update the activity of the user in the map
      userActivities.set(userId, activity);

      // Broadcast the updated activity to all connected clients
      io.emit("activity_updated", { userId, activity });
    });

    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, content } = data;

        const message = await Message.create({
          senderId,
          receiverId,
          content,
        });

        // send to receiver in realtime, if they are online
        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", message);
        }

        socket.emit("message_sent", message);
      } catch (error) {
        console.error("Message error:", error);
        socket.emit("message_error", error.message);
      }
    });

    socket.on("disconnect", () => {
      let disconnectedUserId;
      for (const [userId, socketId] of userSockets.entries()) {
        //find disconnected user
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          userSockets.delete(userId);
          userActivities.delete(userId);
          break;
        }
      }
      if (disconnectedUserId) {
        io.emit("user_disconnected", disconnectedUserId);
      }
    });
  });
};
