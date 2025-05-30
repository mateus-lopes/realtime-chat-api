import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import { router as authRoutes } from "./routes/auth.route.js";
import { router as messageRoutes } from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import { swaggerUi, specs } from "./config/swagger.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Swagger Documentation
app.use(
  "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Realtime Chat API Documentation",
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "Realtime Chat API is running!",
    documentation: "/api-docs",
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  connectDB()
    .then(() => console.log("Database connected successfully"))
    .catch((error) => console.error("Database connection failed:", error));
});
