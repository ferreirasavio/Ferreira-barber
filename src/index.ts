import express from "express";
import scheduleRoutes from "./routes";

const app = express();
const PORT = 3333;

app.use(express.json());
app.use(scheduleRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
