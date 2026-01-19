// View(route)

import express from "express";
const app = express();
const router = express.Router();
// Controller(logic)
import * as controller from "../controller/tweet.js";

app.use(express.json());

// ?? controller.getTweets() 이렇게 ()괄호 쓰면 함수 결과값 전달하는 것 되어버림 -> getTweets 이렇게 써야함
router
  .get("/", controller.getTweets) //
  .post("/", controller.createTweet);

router
  .get("/:id", controller.getTweet)
  .put("/:id", controller.updateTweet)
  .delete("/:id", controller.deleteTweet);

export default router;
