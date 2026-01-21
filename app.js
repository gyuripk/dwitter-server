import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import tweetsRouter from "./router/tweets.js";
import authRouter from "./router/auth.js";
import { config } from "./config.js";
import { initSocket } from "./connection/socket.js";
import { db } from "./db/database.js";

const app = express();

const corsOption = {
  origin: ["http://localhost:3000"], // 특정 IP에서만 cors policy 허용하도록 옵션 줄 수 있음
  optionsSuccessStatus: 200,
  credentials: true, // "Access-Control-Allow-Credentials: true"
};

// middleware
app.use(express.json());
app.use(cors(corsOption));
app.use(morgan("short"));
app.use(helmet());

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
db.getConnection(); //
// .then((connection) => console.log(connection));

const server = app.listen(config.host.port);
initSocket(server);
