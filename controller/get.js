import { tweets } from "../data/data.js";

export function getTweets() {
  return (req, res) => {
    const username = req.query.username;
    const data = username
      ? tweets.filter((tweets) => tweets.username === username)
      : tweets; // array
    console.log(data);

    res.status(200).json(data);
  };
}

export function getTweetById() {
  return (req, res) => {
    const id = req.params.id;
    const tweet = tweets.find((tweet) => tweet.id === id); // an element
    console.log(tweet);

    if (tweet) {
      res.status(200).json(tweet);
    } else {
      res.status(404).json({ message: `Tweet id(${id}) is not found` }); // JS객체 -> json데이터로 변환해서 보냄
    }
  };
}
