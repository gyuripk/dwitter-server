// View(route)
// 외부 라이브러리 먼저 작성
import express from "express";
import { body, query, param, validationResult } from "express-validator";
// 프로젝트 내부 라이브러리 작성
import { validate } from "../middleware/validator.js";
// Controller(logic)
import * as controller from "../controller/tweet.js";
import { isAuth } from "../middleware/auth.js";

const app = express();
const router = express.Router();

// Testing 방식
// Contract Testing: Client-Server
// Proto-

// DB에 일관성 있는 데이터 저장하기 위해 Validate 하기
const validateTweet = [
  body("text")
    .trim() // sanitization
    .isLength({ min: 3 }) // validation
    .withMessage("Text sould be at least 3 characters."),
  validate,
];

app.use(express.json());

// GET /tweets | /tweets?username=:username
router.get("/", isAuth, controller.getTweets);
// POST /tweets
router.post("/", isAuth, validateTweet, controller.createTweet);
// controller.createTweet() 이렇게 ()괄호 쓰면 함수 결과값 전달하는 것 되어버림 -> createTweet 이렇게 써야함

// Authentication
// 현재 로그인 된 userId와 같은 id만 본인 계정으로 트윗수정, 삭제할 수 있음
// GET /tweets/:id
router.get("/:id", isAuth, controller.getTweet);
// PUT /tweets/:id
router.put("/:id", isAuth, validateTweet, controller.updateTweet);
// DELETE /tweets/:id
router.delete("/:id", isAuth, controller.deleteTweet);

export default router;
