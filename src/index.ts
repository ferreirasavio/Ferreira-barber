import dotenv from "dotenv";
import express from "express";
import routes from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  if (Buffer.isBuffer(req.body)) {
    try {
      req.body = JSON.parse(req.body.toString("utf8"));
    } catch (e) {
      return res.status(400).json({ error: "Body inválido" });
    }
  }
  next();
});

app.use(routes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Ferreira Barber API is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.json({ message: "API Ferreira Barber online!" });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/health`);
    console.log(`📅 Schedules API: http://localhost:${PORT}/api/schedules`);
  });
}

export default app;
