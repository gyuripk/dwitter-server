import { ObjectId } from "mongodb";
import { getTweets } from "../db/database.js";
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

export async function getAll() {
  // async: 그 작업이 오래 걸리는 비동기 작업이라고 선언함. (결과가 Promise가 됨)
  // async 함수는 무조건 Promise(약속, 대기표, 진동벨) 리턴함
  //      return { ...tweet, username, name, url };
  return getTweets() //
    .find({})
    .sort({ createdAt: -1 })
    .toArray()
    .then(mapTweets);
}

export async function getAllByUsername(username) {
  return getTweets()
    .find({ username })
    .sort({ createdAt: -1 })
    .toArray()
    .then(mapTweets);
}

export async function getById(id) {
  return getTweets()
    .findOne({ _id: new ObjectId(id) })
    .then(mapOptionalTweet);
}

export async function create(text, userId) {
  // user 데이터 추가 (중복)
  const { username, name, url } = await userRepository.findById(userId);

  const tweet = {
    // automatically generate id
    text,
    createdAt: new Date(),
    userId,
    username,
    name,
    url,
  };
  // insert
  return getTweets()
    .insertOne(tweet)
    .then((data) => mapOptionalTweet({ ...tweet, _id: data.insertedId }));
}

export async function update(id, text) {
  return await getTweets()
    .findOneAndUpdate(
      { _id: new ObjectId(id) }, // 1. 찾기 (Filter)
      { $set: { text } }, // 2. 수정하기 (Update)
      { returnDocument: "after" }, // 3. 수정된 후("after")의 데이터를 줘!
    )
    .then(mapOptionalTweet);
}

export async function remove(id) {
  return await getTweets().deleteOne({ _id: new ObjectId(id) });
}

function mapOptionalTweet(tweet) {
  return tweet ? { ...tweet, id: tweet._id.toString() } : tweet;
}

function mapTweets(tweets) {
  return tweets.map(mapOptionalTweet);
  // return tweets.map((tweet) => mapOptionalTweet(tweet)); // 위 코드와 동일
}
