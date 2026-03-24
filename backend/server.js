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
  origin: [
    "http://localhost:5173",
    "https://sheethub.bluelabtech.space"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
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
  console.error(err.stack);
  res.status(500).json({ error: "Server error" });
});

// PORT (IMPORTANT for Render)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server started");
  console.log(`Server running on port ${PORT}`);
  console.log("PDF routes mounted at /api/pdf");
  console.log('--- REGISTERED API ROUTES ---');
  app._router.stack.forEach((middleware) => {
    if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods).join(', ').toUpperCase();
          console.log(`[ROUTE] ${methods} /api/pdf${handler.route.path}`);
        }
      });
    } else if (middleware.route) {
      const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
      console.log(`[ROUTE] ${methods} ${middleware.route.path}`);
    }
  });
  console.log('-----------------------------');
});