// Controller(logic)

// Modle(data)
import * as tweetRepository from "../data/tweet.js";

export function getTweets(req, res) {
  // ?? 일반 function이라서 => 쓰면 X
  const username = req.query.username;
  const data = username
    ? tweetRepository.getAllByUsername(username)
    : tweetRepository.getAll; // array
  console.log(data);

  res.status(200).json(data);
}

export function getTweet(req, res) {
  const id = req.params.id; // string -> int

  const tweet = tweetRepository.getById;

  if (tweet) {
    res.status(200).json(tweet);
  } else {
    res.status(404).json({ message: `Tweet id(${id}) is not found` }); // JS객체 -> json데이터로 변환해서 보냄
  }
}
export function createTweet(req, res) {
  const { text, name, username } = req.body; // object Destructuring
  // 객체 안에 있는 값을 쏙쏙 뽑아서 변수로 만드는 문법

  const tweet = tweetRepository.create(text, name, username);
  res.status(201).json(tweet);
}
export function updateTweet(req, res) {
  // req
  const id = req.params.id;
  const text = req.body.text;
  const tweet = tweetRepository.update(id, text);

  if (tweet) {
    res.status(200).json(tweet);
  } else {
    // tweet : undefined
    res.status(404).json({ message: `Tweet id(${id}) is not found.` });
  }
}
export function deleteTweet(req, res) {
  const id = req.params.id;

  tweetRepository.remove(id);

  res.status(204).send("Succesfully deleted!");
}
