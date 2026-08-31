import path from "path";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import hpp from "hpp";
import pinoHttp from "pino-http";
import { logger } from "./utils/logger";
import { apiLimiter } from "./middlewares/rateLimit.middleware";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware";
import routes from "./routes";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(helmet());
// Reflects whatever Origin the request sends (no allowlist) so the API is
// reachable from any port/host during development, instead of erroring out
// whenever a local dev server isn't running on one of a fixed set of ports.
// Temporarily disabled for debugging the live-server login redirect issue.
// app.use(cors({ origin: true, credentials: true }));
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

// Uploaded images are requested cross-origin by the storefront/admin apps (different
// ports = different origins); helmet's default same-origin Cross-Origin-Resource-Policy
// would otherwise silently block <img> tags from loading them.
app.use(
  "/uploads",
  (_req, res, next) => {
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(process.cwd(), "uploads")),
);

app.use("/api/v1", apiLimiter, routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
