const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = express();

/* ================= CREATE SERVER ================= */
const server = http.createServer(app);

/* ================= CORS CONFIGURATION ================= */
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

// Log allowed origins at startup for diagnostic purposes
console.log(`[CORS] Allowed origins: ${JSON.stringify(allowedOrigins)}`);

// Helper to normalize origin strings for robust comparison (trim, remove trailing slash, lowercase)
const normalizeOrigin = (url) => {
  if (!url) return "";
  return String(url).trim().replace(/\/$/, "").toLowerCase();
};

const corsOptionsOrigin = (origin, callback) => {
  // Allow requests with no origin (like server-to-server or curl requests)
  if (!origin) return callback(null, true);

  const cleanOrigin = normalizeOrigin(origin);
  const isAllowed = allowedOrigins.some(allowed => normalizeOrigin(allowed) === cleanOrigin);

  if (isAllowed) {
    callback(null, true);
  } else {
    // Log the rejected origin safely for diagnostics
    console.log(`[CORS] Rejected CORS origin: ${origin}`);
    callback(null, false); // Safely reject without throwing a 500 error in Express
  }
};

/* ================= SOCKET.IO ================= */
const io = new Server(server, {
  cors: {
    origin: corsOptionsOrigin,
    credentials: true,
  },
});

// 🔥 Store connected users
let users = {};

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // Register user
  socket.on("register", (userId) => {
    users[userId] = socket.id;
    console.log("✅ User registered:", userId);
  });

  // Register for analytics updates
  socket.on("register-analytics", (data) => {
    console.log("📊 Analytics registered for user:", data?.userId || "unknown");
    socket.join("analytics-room");
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);

    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
      }
    }
  });
});

// 🔥 make available in routes
app.set("io", io);
app.set("users", users);

/* ================= CORS ================= */
app.use(
  cors({
    origin: corsOptionsOrigin,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

/* ================= MIDDLEWARE ================= */
app.use(express.json());

/* ================= ROUTES ================= */
app.use("/api", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));

app.use("/api/users", require("./routes/userRouter"));
app.use("/api/sports", require("./routes/sportRouter"));
app.use("/api/teams", require("./routes/teamRouter"));
app.use("/api/tournaments", require("./routes/tournamentRoutes"));
app.use("/api/matches", require("./routes/matchRouter"));
app.use("/api/registrations", require("./routes/registrationRouter"));
app.use("/api/venues", require("./routes/venueRouter"));
app.use("/api/sponsors", require("./routes/sponsorRouter"));

app.use("/api/notifications", require("./routes/notificationRouter"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/prize-distributions", require("./routes/prizeDistributionRouter"));

// Analytics Routes - Real-time dashboard stats
app.use("/api/analytics", require("./routes/analyticsRouter"));

const { getSchedule } = require("./controllers/matchController");
const { blockOrganizerJoin } = require("./controllers/teamController");

// Schedule shortcut endpoint
app.get("/api/schedule", require("./middleware/authMiddleware"), getSchedule);

// Block organizer from joining team (fallback /api/join-team check)
app.post("/api/join-team", require("./middleware/authMiddleware"), blockOrganizerJoin);

app.use("/uploads", express.static("uploads"));

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

/* ================= DATABASE ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("UNHANDLED ERROR:", err);

  if (err && err.name === "MulterError") {
    return res.status(400).json({ message: err.message });
  }

  // Handle validation errors
  if (err && err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }

  // Handle Mongoose Cast Error (e.g. invalid ObjectId)
  if (err && err.name === "CastError") {
    return res.status(400).json({ message: `Invalid ID format for path: ${err.path}` });
  }

  // Handle duplicate key errors
  if (err && err.code === 11000) {
    return res.status(400).json({ message: "Duplicate entry found" });
  }

  res.status(500).json({ message: err.message || "Internal Server Error" });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Frontend URL: http://localhost:5173`);
  console.log(`📡 Socket.IO ready for real-time updates`);
  console.log(`📊 Analytics endpoint: http://localhost:${PORT}/api/analytics/stats`);
});