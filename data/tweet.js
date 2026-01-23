import { db } from "../db/database.js";
import * as userRepository from "./auth.js";
// Model(data)
// data 읽고 쓰는 로직은 여기에

// DB에서 데이터 읽고 쓸 때는 시간 오래 걸림
// 데이터관련 일 수행하는 동안 서버가 다른 것도 실행할 수 있게
// 비동기적으로 처리해주는 것이 좋음 async
// 그냥 리턴 하더라도 async 키워드 붙으면 promise형태로 반환함 (JS 문법)

//template literal
// `template literal ${id} yeah!`

const SELECT_JOIN =
  "SELECT tw.id, tw.text, tw.createdAt, tw.userId, us.username, us.name, us.url FROM tweets as tw JOIN users as us on tw.userId = us.id";
const ORDER_DESC = "ORDER BY tw.createdAt DESC";

export async function getAll() {
  return db.execute(`${SELECT_JOIN} ${ORDER_DESC}`).then((result) => result[0]);
}

export async function getAllByUsername(username) {
  return db
    .execute(`${SELECT_JOIN} WHERE username = ? ${ORDER_DESC}`, [username])
    .then((result) => result[0]);
}

export async function getById(id) {
  return db
    .execute(`${SELECT_JOIN} WHERE tw.id = ?`, [id])
    .then((result) => result[0][0]);
}

export async function create(text, userId) {
  return db
    .execute("INSERT INTO tweets (text, createdAt, userId) VALUES (?,?,?)", [
      text,
      new Date(),
      userId,
    ])
    .then((result) => getById(result[0].insertId)); // 생성된 트윗 반환
}

export async function update(id, text) {
  return db
    .execute(`UPDATE tweets SET text=? WHERE id=?`, [text, id])
    .then((result) => getById(id));
}

export async function remove(id) {
  db.execute(`DELETE FROM tweets WHERE id = ?`, [id]);
}
