import dotenv from "dotenv";
import express from "express";
import scheduleRoutes from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Ferreira Barber API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", scheduleRoutes);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/health`);
    console.log(`📅 Schedules API: http://localhost:${PORT}/api/schedules`);
  });
}

export default app;
