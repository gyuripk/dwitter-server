// Model(data)
// data 읽고 쓰는 로직은 여기에

// data on memory
// 서버에서 let과 같은 데이터 state 가지고 있는 건 최악임
// but DB연결 전에 일시적으로 테스트용으로 이렇게 저장함
let tweets = [
  {
    id: "1", // 트윗 아이디
    text: "hi gyuri", // 트윗 텍스트
    createdAt: Date.now().toString(), // 트윗 생성 날짜
    name: "Gyuri", // 사용자 이름
    username: "gyuri", // 사용자 닉네임 (아이디)
    url: "", // 사용자 프로파일 사진 URL
  },
  {
    id: "2", // 트윗 아이디
    text: "This is Ellie", // 트윗 텍스트
    createdAt: Date.now().toString(), // 트윗 생성 날짜
    name: "Ellie", // 사용자 이름
    username: "ellie", // 사용자 닉네임 (아이디)
    url: "", // 사용자 프로파일 사진 URL
  },
];

// DB에서 데이터 읽고 쓸 때는 시간 오래 걸림
// 데이터관련 일 수행하는 동안 서버가 다른 것도 실행할 수 있게
// 비동기적으로 처리해주는 것이 좋음 async
// 그냥 리턴 하더라도 async 키워드 붙으면 promise형태로 반환함 (JS 문법)

export async function getAll() {
  return tweets;
}
export async function getAllByUsername(username) {
  return tweets.filter((t) => t.username === username);
}

export async function getById(id) {
  return tweets.find((t) => t.id === id);
}
export async function remove(id) {
  tweets = tweets.filter((t) => t.id !== id);
}

export async function update(id, text) {
  const tweet = tweets.find((t) => t.id === id);
  if (tweet) {
    tweet.text = text;
  }
  return tweet;
}

export async function create(text, name, username) {
  const tweet = {
    id: Date.now().toString(),
    text,
    createdAt: new Date(),
    name,
    username,
  };
  tweets = [tweet, ...tweets];
  // tweets.push(newData); // 새 tweet이 배열 제일 뒤에 옴
  // 트위터 특성상 최근 데이터가 배열 제일 앞에 와야함
  return tweet;
}
