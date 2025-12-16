import express from "express";

import { checkToken } from "./middleware/auth";
import privateRoutes from "./routes/private";
import publicRoutes from "./routes/public";

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, _res, next) => {
  if (Buffer.isBuffer(req.body)) {
    try {
      req.body = JSON.parse(req.body.toString());
    } catch {
      req.body = req.body.toString();
    }
  }
  next();
});

app.use(express.json());

app.use(publicRoutes);

app.use(checkToken);

app.use(privateRoutes);

app.get("/health", (_req, res) => {
  res.json({
    status: 200,
    message: "Ferreira Barber API is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (_req, res) => {
  res.json({ message: "API Ferreira Barber online!" });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

export default app;
