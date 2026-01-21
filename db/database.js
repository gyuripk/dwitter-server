import mysql from "mysql2";
import { config } from "../config.js";

const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  database: config.db.database,
  password: config.db.password,
});

// async (promise) ??
// data Model에서 이 db 이용해서 접속, CURD함
export const db = pool.promise();
