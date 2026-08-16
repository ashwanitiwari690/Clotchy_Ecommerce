import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import hpp from "hpp";
import pinoHttp from "pino-http";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { apiLimiter } from "./middlewares/rateLimit.middleware";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware";
import { ApiError } from "./utils/ApiError";
import routes from "./routes";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

const allowedOrigins = env.CORS_ORIGIN.split(",").map((origin) => origin.trim());

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // No origin (e.g. curl/Postman/server-to-server) is allowed through;
      // browser requests always send an Origin header for cross-origin calls.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(ApiError.forbidden("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(compression());
app.use(hpp());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(
  pinoHttp({
    logger,
    // Skip logging noisy, high-frequency health checks (e.g. load balancer pings).
    autoLogging: { ignore: (req) => req.url === "/api/v1/health" },
  }),
);

app.use("/api/v1", apiLimiter, routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
