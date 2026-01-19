import * as userRepository from "./auth.js";
// Model(data)
// data 읽고 쓰는 로직은 여기에

// data on memory
// 서버에서 let과 같은 데이터 state 가지고 있는 건 최악임
// but DB연결 전에 일시적으로 테스트용으로 이렇게 저장함
let tweets = [
  {
    id: "1", // 트윗 아이디
    text: "hi gyuri", // 트윗 텍스트
    createdAt: new Date().toString(), // 트윗 생성 날짜
    userId: "1", // foreingkey
  },
  {
    id: "2", // 트윗 아이디
    text: "This is Ellie", // 트윗 텍스트
    createdAt: new Date().toString(), // 트윗 생성 날짜
    userId: "1",
  },
];

// DB에서 데이터 읽고 쓸 때는 시간 오래 걸림
// 데이터관련 일 수행하는 동안 서버가 다른 것도 실행할 수 있게
// 비동기적으로 처리해주는 것이 좋음 async
// 그냥 리턴 하더라도 async 키워드 붙으면 promise형태로 반환함 (JS 문법)

// export async function getAll() {
//   return tweets;
// }

export async function getAll() {
  return Promise.all(
    // Promise.all(): map의 결과인 '대기표 뭉치'가 다 처리되어 데이터로 마뀔 때까지 기다림
    // Promise.all: 여러 개의 비동기 작업(Promise들)이 전부 끝날 때까지 기다렸다가 한 방에 결과를 반환함
    tweets.map(async (tweet) => {
      // map: 배열 안의 요소 하나씩 꺼내 1대 1로 변환시키는 함수
      // 이 결과는 '데이터 배열'이 아니라, '대기표들의 배열'이 됨
      const { username, name, url } = await userRepository.findById(
        tweet.userId
      );
      // DB나 파일 탐색작업은 시간 오래걸림 -> 비동기 작업 => async, await 키워드 사용
      // async: 그 작업이 오래 걸리는 비동기 작업이라고 선언함. (결과가 Promise가 됨)
      // async 함수는 무조건 Promise(약속, 대기표, 진동벨) 리턴함

      return { ...tweet, username, name, url };
    })
  );
}

export async function getAllByUsername(username) {
  return getAll().then((tweets) =>
    tweets.filter((tweet) => tweet.username === username)
  );
}

export async function getById(id) {
  const found = tweets.find((t) => t.id === id);
  if (!found) {
    return null;
  }
  const { username, name, url } = await userRepository.findById(found.userId);
  return { ...found, username, name, url };
}

export async function create(text, userId) {
  const tweet = {
    id: new Date().toString(),
    text,
    createdAt: new Date(),
    userId,
  };
  tweets = [tweet, ...tweets];
  // tweets.push(newData); // 새 tweet이 배열 제일 뒤에 옴
  // 트위터 특성상 최근 데이터가 배열 제일 앞에 와야함
  return getById(tweet.id); // 생성된 트윗 반환
}

export async function update(id, text) {
  const tweet = tweets.find((t) => t.id === id);
  if (tweet) {
    tweet.text = text;
  }
  return getById(tweet.id);
}

export async function remove(id) {
  tweets = tweets.filter((t) => t.id !== id);
}
