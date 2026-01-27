import MongoDB from "mongodb";
import { config } from "../config.js";

let db; // 이 모듈 안에서만 쓸 수 있는 변수
export async function conncetDB() {
  // Connect the client to the server
  return MongoDB.MongoClient.connect(config.db.host) // access a Databases
    .then((client) => {
      db = client.db("dwitter"); // 연결한 db 변수에 담기
    });
}

// access a Collection (table)
// 왜 async 안 붙임?
export function getUsers() {
  return db.collection("users");
}

export function getTweets() {
  return db.collection("tweets");
}
