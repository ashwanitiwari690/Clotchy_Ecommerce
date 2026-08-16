import { PrismaClient } from "@prisma/client";

// "query" logging is opt-in (not on by default even in dev) since it adds
// console I/O overhead on every request and slows down the dev server visibly.
export const prisma = new PrismaClient({
  log: process.env.PRISMA_LOG_QUERIES === "true" ? ["query", "error", "warn"] : ["error", "warn"],
});
