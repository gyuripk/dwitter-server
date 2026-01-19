// 비즈니스 로직

import * as data from "../data/tweet.js";

export function getTweets() {
  let tweets = data.getAll();
  return (req, res) => {
    const username = req.query.username;
    const data = username
      ? tweets.filter((tweets) => tweets.username === username)
      : tweets; // array
    console.log(data);

    res.status(200).json(data);
  };
}

export function deleteTweetById() {
  let tweets = data.getAll();

  (req, res) => {
    const id = req.params.id;
    console.log(id);

    tweets = tweets.remove(id);
    // tweets = tweets.filter((t) => t.id !== id); // 해당 id 아닌 트윗들만 다시 tweets에 담기 == 해당 Id 트윗 삭제하는 효과
    console.log(tweets);

    res.status(204).send("Succesfully deleted!");
  };
}
