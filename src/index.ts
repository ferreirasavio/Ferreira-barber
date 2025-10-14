import dotenv from "dotenv";
import express from "express";
import routes from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(routes);

function autoResponder(handler: (...args: any[]) => any) {
  return async (req: any, res: any, next: any) => {
    try {
      const result = await handler(req, res, next);
      if (res.headersSent) return;
      if (result !== undefined) {
        res.json(result);
      }
    } catch (err) {
      next(err);
    }
  };
}
app.get(
  "/health",
  autoResponder(() => {
    return {
      status: 200,
      message: "Ferreira Barber API is running",
      timestamp: new Date().toISOString(),
    };
  })
);

app.get(
  "/",
  autoResponder(() => {
    return { message: "API Ferreira Barber online!" };
  })
);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

export default app;
