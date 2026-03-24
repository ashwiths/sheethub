process.on('uncaughtException', (err, origin) => {
  console.error(`Caught exception: ${err}\nException origin: ${origin}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const express = require("express");
const cors = require("cors");
const { execSync } = require("child_process");
const pdfRoutes = require("./routes/pdfRoutes");

let commitHash = 'unknown';
try {
  commitHash = execSync('git rev-parse HEAD').toString().trim();
} catch (e) {
  // Ignore if not a git repo
}

const app = express();

// CORS
app.use(cors({
  origin: "*"
}));

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Routes
app.use("/api/pdf", pdfRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Backend running");
});

// Detailed API Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Backend is running smoothly 🚀",
    commit: commitHash,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    env: process.env.NODE_ENV || "development",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err?.stack || err);
  res.status(500).json({ error: "Internal Server Error" });
});

// PORT configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log("Server started");
  console.log(`Server running on port ${PORT}`);
});