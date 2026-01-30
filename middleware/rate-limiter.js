import rateLimit from "express-rate-limit";
import { config } from "../config.js";

export default rateLimit({
  windowMs: config.rateLimit.windowMs, // fixed window milliseconds
  max: config.rateLimit.maxRequest,
});
