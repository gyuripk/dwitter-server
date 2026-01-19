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
    text: "This is Bob", // 트윗 텍스트
    createdAt: Date.now().toString(), // 트윗 생성 날짜
    name: "Ellie", // 사용자 이름
    username: "ellie", // 사용자 닉네임 (아이디)
    url: "", // 사용자 프로파일 사진 URL
  },
];

export function getAll() {
  return tweets;
}

export function getById(id) {
  return (tweet = tweets.find((t) => t.id === id));
}
export function remove(id) {
  tweets = tweets.filter((t) => t.id !== id);
}
