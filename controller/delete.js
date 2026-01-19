import { tweets } from "../data/tweet.js";

export function deleteTweetById() {
  return (req, res) => {
    const id = req.params.id;
    console.log(id);

    tweets = tweets.filter((t) => t.id !== id); // 해당 id 아닌 트윗들만 다시 tweets에 담기 == 해당 Id 트윗 삭제하는 효과
    console.log(tweets);

    res.status(204).send("Succesfully deleted!");
  };
}
