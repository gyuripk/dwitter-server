// Controller(logic)
// 비즈니스 로직만 담고 Validation은 라우터에서 하기
// Model과 통신, 에러 발생시 어떻게 보여줄지만 적기

// Modle(data)
import * as tweetRepository from "../data/tweet.js";

//서버가 다른 것도 실행할 수 있게
// 비동기적으로 처리해주는 것이 좋음 async
export async function getTweets(req, res) {
  // ?? 일반 function이라서 => 쓰면 X
  // ?? function getTweets(인자들) {} 함수 정의로 만들었기 때문에, 함수 () => {} arrow function 문법을 함수 정의로 변경해준 것
  const username = req.query.username;
  const data = await (username
    ? tweetRepository.getAllByUsername(username)
    : tweetRepository.getAll()); // array
  console.log(data);

  res.status(200).json(data);
}

export async function getTweet(req, res) {
  const id = req.params.id; // string -> int

  const tweet = await tweetRepository.getById(id);
  // 다 비동기 함수라 .then() 또는 await로 함수 다 실행된 후 처리할 것 적으면 됨
  // promise 다 끝날 때까지 기다렸다가 tweet에 그 결과값 할당

  if (tweet) {
    res.status(200).json(tweet);
  } else {
    res.status(404).json({ message: `Tweet id(${id}) is not found` }); // JS객체 -> json데이터로 변환해서 보냄
  }
}
export async function createTweet(req, res) {
  const { text } = req.body; // object Destructuring
  // 객체 안에 있는 값을 쏙쏙 뽑아서 변수로 만드는 문법
  const tweet = await tweetRepository.create(text, req.userId); // auth middleware에서 저장한 userId값을 request에서 읽어와 트윗 만듬
  res.status(201).json(tweet);
}
export async function updateTweet(req, res) {
  // req
  const id = req.params.id;
  const text = req.body.text;
  const tweet = await tweetRepository.update(id, text);

  if (tweet) {
    res.status(200).json(tweet);
  } else {
    // tweet : undefined
    res.status(404).json({ message: `Tweet id(${id}) is not found.` });
  }
}
export async function deleteTweet(req, res) {
  const id = req.params.id;

  await tweetRepository.remove(id);

  res.status(204).send("Succesfully deleted!");
}
