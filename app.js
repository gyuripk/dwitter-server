import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import tweetsRouter from "./router/tweets.js";
import authRouter from "./router/auth.js";
import { config } from "./config.js";
import { initSocket } from "./connection/socket.js";
import { connectDB } from "./db/database.js";
import { csrfCheck } from "./middleware/csrf.js";
import rateLimit from "./middleware/rate-limiter.js";

const app = express();

const corsOption = {
  origin: config.cors.allowedOrigin, // 특정 IP에서만 cors policy 허용하도록 옵션 줄 수 있음
  optionsSuccessStatus: 200,
  credentials: true, // "Access-Control-Allow-Credentials: true"
  // cookie, token 보내도 된다는 허락
  // 서버에서 보낸 body를 클라이언트에서 수락
};

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOption));
app.use(morgan("short"));

app.use(rateLimit); // csrfCheck 보다 먼저 실행해야 GET포함 모든 요청에 제한걸 수있음
app.use(csrfCheck); // 서버 변경 안되는 GET 요청은 검사안함

// router
app.use("/tweets", tweetsRouter);
app.use("/auth", authRouter);

// error handling
app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((errror, req, res, next) => {
  console.error(errror);
  res.sendStatus(500);
});

// connect to db
connectDB()
  .then(() => {
    console.log(`Server is started... ${new Date()}`);

    const server = app.listen(config.port);
    initSocket(server);
  })
  .catch(console.error);
