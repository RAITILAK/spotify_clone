import dotenv from "dotenv";
import express from "express";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import { createServer } from "http";

import { initializeSocket } from "./lib/socket.js";
import { connectDB } from "./lib/db.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";

// ✅ Catch unexpected errors
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err);
});

dotenv.config();

console.log("✅ Loaded environment variables");

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

console.log("🚀 PORT:", PORT);

const httpServer = createServer(app);

// ✅ Initialize socket with logging
try {
  initializeSocket(httpServer);
  console.log("✅ Socket initialized");
} catch (err) {
  console.error("❌ Error initializing socket:", err);
}

// ✅ Configure CORS
try {
  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "https://spotify-clone-4toy.onrender.com", // Replace with current live domain
      ],
      credentials: true,
    })
  );
  console.log("✅ CORS configured");
} catch (err) {
  console.error("❌ Error configuring CORS:", err);
}

app.use(express.json());
console.log("✅ JSON parser added");

// ✅ Clerk middleware
try {
  app.use(clerkMiddleware());
  console.log("✅ Clerk middleware added");
} catch (err) {
  console.error("❌ Error adding Clerk middleware:", err);
}

// ✅ File Upload
try {
  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: path.join(__dirname, "temp"),
      createParentPath: true,
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
      },
    })
  );
  console.log("✅ File upload configured");
} catch (err) {
  console.error("❌ Error configuring file upload:", err);
}

// ✅ Routes
try {
  app.use("/api/users", userRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/songs", songRoutes);
  app.use("/api/albums", albumRoutes);
  app.use("/api/stats", statRoutes);
  console.log("✅ API routes mounted");
} catch (err) {
  console.error("❌ Error mounting routes:", err);
}

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../../frontend/dist");
  console.log("🛠 Serving static frontend from:", frontendPath);

  app.use(express.static(frontendPath));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
}

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Global Error Handler:", err);
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

// ✅ Start server
httpServer.listen(PORT, () => {
  console.log("✅ Server is running on port " + PORT);
  connectDB();
});

// import dotenv from "dotenv";
// import express from "express";
// import { clerkMiddleware } from "@clerk/express";
// import fileUpload from "express-fileupload";
// import path from "path";
// import cors from "cors";
// // import fs from "fs";
// import { createServer } from "http";
// // import cron from "node-cron";

// import { initializeSocket } from "./lib/socket.js";

// import { connectDB } from "./lib/db.js";
// import userRoutes from "./routes/user.route.js";
// import adminRoutes from "./routes/admin.route.js";
// import authRoutes from "./routes/auth.route.js";
// import songRoutes from "./routes/song.route.js";
// import albumRoutes from "./routes/album.route.js";
// import statRoutes from "./routes/stat.route.js";

// dotenv.config();

// const app = express();
// const __dirname = path.resolve();
// const PORT = process.env.PORT || 5000;

// console.log("PORT:", PORT);

// const httpServer = createServer(app);
// initializeSocket(httpServer);

// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "https://spotify-clone-4toy.onrender.com",
//     ],
//     credentials: true,
//   })
// );

// app.use(express.json()); // to parse req.body(json data)
// app.use(clerkMiddleware()); // this will add auth to req obj => req.user

// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: path.join(__dirname, "temp"),
//     createParentPath: true,
//     limits: {
//       fileSize: 10 * 1024 * 1024, // 10mb max file size
//     },
//   })
// );

// // cron jobs (autmoatic deletion of temp files)
// // const tempDir = path.join(process.cwd(), "tmp");
// // cron.schedule("0 * * * *", () => {
// // 	if (fs.existsSync(tempDir)) {
// // 		fs.readdir(tempDir, (err, files) => {
// // 			if (err) {
// // 				console.log("error", err);
// // 				return;
// // 			}
// // 			for (const file of files) {
// // 				fs.unlink(path.join(tempDir, file), (err) => {});
// // 			}
// // 		});
// // 	}
// // });

// app.use("/api/users", userRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/songs", songRoutes);
// app.use("/api/albums", albumRoutes);
// app.use("/api/stats", statRoutes);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../../frontend/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../../frontend/dist/index.html"));
//   });
// }

// //error handler
// app.use((err, req, res, next) => {
//   console.error("🔥 Error:", err); // 👈 add this line to log full error in console/logs

//   res.status(500).json({
//     message:
//       process.env.NODE_ENV === "production"
//         ? "Internal Server error"
//         : err.message,
//   });
// });

// httpServer.listen(PORT, () => {
//   console.log("Server is running on port " + PORT);
//   connectDB();
// });

// //socket io will be implemented here to do
