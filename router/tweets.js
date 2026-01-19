import express from "express";
const app = express();
const router = express.Router();
// data
import * as tweetRepository from "../data/tweet.js";
// logic
import * as controller from "../controller/controller.js";

app.use(express.json());

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

router
  .get("/", (req, res) => {
    const username = req.query.username;
    const data = username
      ? tweets.filter((tweets) => tweets.username === username)
      : tweets; // array
    console.log(data);

    res.status(200).json(data);
  })
  .post("/", (req, res) => {
    console.log(req.body);
    const { text, name, username } = req.body; // object Destructuring
    // 객체 안에 있는 값을 쏙쏙 뽑아서 변수로 만드는 문법
    const tweet = {
      id: Date.now().toString(),
      text,
      createdAt: new Date(),
      name,
      username,
    };
    // tweets.push(newData); // 새 tweet이 배열 제일 뒤에 옴
    // 트위터 특성상 최근 데이터가 배열 제일 앞에 와야함
    tweets = [tweet, ...tweets];
    res.status(201).json(tweet);
  });

router
  .get("/:id", (req, res) => {
    const id = req.params.id; // string -> int

    const tweet = tweets.find((tweet) => tweet.id === id); // an element
    console.log(tweet);

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
    const tweet = tweets.find((t) => t.id === id);
    console.log(tweet);

    // res
    if (tweet) {
      tweet.text = text;
      res.status(200).json(tweet);
    } else {
      res.status(404).json({ message: `Tweet id(${id}) is not found.` });
    }
  })
  .delete("/:id", (req, res) => {
    const id = req.params.id;
    console.log(id);

    tweets = tweets.filter((t) => t.id !== id); // 해당 id 아닌 트윗들만 다시 tweets에 담기 == 해당 Id 트윗 삭제하는 효과
    console.log(tweets);

    res.status(204).send("Succesfully deleted!");
  });

export default router;
