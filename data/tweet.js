import Mongoose from "mongoose";
import { useVirtualId } from "../db/database.js";
import * as userRepository from "./auth.js";
// Model(data)
// data 읽고 쓰는 로직은 여기에

// NoSQL (데이터 중복 > 관계)
// 프로필 DB, 사용자의 문서 DB 각각 독립된 데이터 저장
// 수평적 확장에 유리 (서버1, 서버2, 서버3 ...)
// 트윗 쿼리 횟수 > 유저정보 업뎃 횟수
// 유저정보 업뎃의 경우 -> 서버가 한가한 시간에 스케줄링해 모든 트윗에 유저정보 업데이트

// SQL: 관계형
// 조인쿼리의 성능이 좋기때문에 사용

// DB에서 데이터 읽고 쓸 때는 시간 오래 걸림
// 데이터관련 일 수행하는 동안 서버가 다른 것도 실행할 수 있게
// 비동기적으로 처리해주는 것이 좋음 async
// 데이터를 리턴 하더라도 async 키워드 붙으면 promise형태로 반환함 (JS 문법)

// data integrity, validate data
const tweetSchema = new Mongoose.Schema(
  {
    username: { type: String, required: true },
    name: { type: String, required: true },
    text: { type: String, required: true },
    userId: { type: String, required: true },
    url: String,
  },
  { timestamps: true }, // createdAt
);

useVirtualId(tweetSchema);
const Tweet = Mongoose.model("Tweet", tweetSchema);

export async function getAll() {
  // async: 그 작업이 오래 걸리는 비동기 작업이라고 선언함. (결과가 Promise가 됨)
  // async 함수는 무조건 Promise(약속, 대기표, 진동벨) 리턴함
  //      return { ...tweet, username, name, url };
  return Tweet.find().sort({ createdAt: -1 });
}

export async function getAllByUsername(username) {
  return Tweet.find({ username }).sort({ createdAt: -1 });
}

export async function getById(id) {
  return Tweet.findById(id);
}

export async function create(text, userId) {
  // user 데이터 추가 (중복)>
  return userRepository.findById(userId).then((user) =>
    Tweet.insertOne({
      text,
      userId,
      username: user.username,
      name: user.name,
      url: user.url,
    }),
  );
}

export async function update(id, text) {
  return Tweet.findByIdAndUpdate(id, { text }, { returnDocument: "after" });
}

export async function remove(id) {
  return Tweet.findByIdAndDelete(id);
}
