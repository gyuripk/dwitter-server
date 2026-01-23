import { config } from "../config.js";
import SQ from "sequelize";

const { host, user, database, password } = config.db;

// sequelize 객체 export
export const sequelize = new SQ.Sequelize(database, user, password, {
  host,
  dialect: "mysql",
  logging: false, // db 실행 로그 남지 않음 -> 개발시 truen, 배포시 fasle
});
