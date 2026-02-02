import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.js";

// Routes
import authRoutes from "./routes/auth.route.js";
import journalRoutes from "./routes/journal.route.js";
import firebaseAuthRoutes from "./routes/firebase.route.js";
import insightRoutes from "./routes/insight.route.js";
import searchRoutes from "./routes/search.route.js";

dotenv.config();

const app = express();

// ----------------- DB Connection Cache -----------------
let cachedDb = null;
async function initDB() {
  if (cachedDb) return cachedDb;

  try {
    if (process.env.MONGO_URI) {
      cachedDb = await connectDB();
      console.log("✅ MongoDB connected");
    } else {
      console.warn("⚠️ MONGO_URI not set — skipping DB connect");
    }
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }

  return cachedDb;
}

// Initialize DB immediately (optional, will still lazy-load in routes)
initDB();

// ----------------- CORS -----------------
const allowedOrigins = [
  "https://mind-echo-xxlv.vercel.app",
  "http://localhost:5173",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.options(/.*/, cors(corsOptions));

app.use(express.json());

// ----------------- Prevent favicon/image crashes -----------------
app.get("/favicon.ico", (req, res) => res.status(204).end());
app.get("/favicon.png", (req, res) => res.status(204).end());

// ----------------- Log missing params -----------------
app.use((req, res, next) => {
  const missingParams = [];

  if (req.body) {
    for (const [key, value] of Object.entries(req.body)) {
      if (value === undefined) missingParams.push(key);
    }
  }

  if (req.query) {
    for (const [key, value] of Object.entries(req.query)) {
      if (value === undefined) missingParams.push(key);
    }
  }

  if (missingParams.length > 0) {
    console.warn(`⚠️ Missing parameters: ${missingParams.join(", ")}`);
  }

  next();
});

// ----------------- Routes -----------------
app.get("/", (req, res) => {
  res.send("Emotion Journal API is running...");
});

app.get("/ping", (req, res) => res.send("pong"));

app.use("/api/auth", authRoutes);
app.use("/api/auth/firebase", firebaseAuthRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/search", searchRoutes);

// ----------------- Global error handler -----------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

// ----------------- Export for Vercel -----------------
export default app;
