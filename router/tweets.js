// View(route)

import express from "express";
const app = express();
const router = express.Router();
// data
import * as tweetRepository from "../data/tweet.js";
// logic
import * as controller from "../controller/tweet.js";

app.use(express.json());

router
  .get("/", (req, res) => {
    const username = req.query.username;
    const data = username
      ? tweetRepository.getAllByUsername(username)
      : tweetRepository.getAll; // array
    console.log(data);

    res.status(200).json(data);
  })
  .post("/", (req, res) => {
    const { text, name, username } = req.body; // object Destructuring
    // 객체 안에 있는 값을 쏙쏙 뽑아서 변수로 만드는 문법

    const tweet = tweetRepository.create(text, name, username);
    res.status(201).json(tweet);
  });

router
  .get("/:id", (req, res) => {
    const id = req.params.id; // string -> int

    const tweet = tweetRepository.getById;

    if (tweet) {
      res.status(200).json(tweet);
    } else {
      res.status(404).json({ message: `Tweet id(${id}) is not found` }); // JS객체 -> json데이터로 변환해서 보냄
    }
  })
  .put("/:id", (req, res) => {
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
  })
  .delete("/:id", (req, res) => {
    const id = req.params.id;

    tweetRepository.remove(id);

    res.status(204).send("Succesfully deleted!");
  });

export default router;
