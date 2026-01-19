import express from "express";
import tweetsRouter from "./router/tweets.js";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

const app = express();

const corsOption = {
  origin: ["http://localhost:3000"], // 특정 IP에서만 cors policy 허용하도록 옵션 줄 수 있음
  optionsSuccessStatus: 200,
  credentials: true, // "Access-Control-Allow-Credentials: true"
};

app.use(express.json());
app.use(cors(corsOption));
app.use(morgan("short"));
app.use(helmet());

app.use("/tweets", tweetsRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

// error handling
app.use((errror, req, res, next) => {
  console.error(errror);
  res.sendStatus(500);
});
app.listen(8080);
