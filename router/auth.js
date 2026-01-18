import express from "express";
import { validate } from "../middleware/validator.js";
import { body, query, param, validationResult } from "express-validator";
import * as authController from "../controller/auth.js";
import { isAuth } from "../middleware/auth.js";
// const app = express();
const router = express.Router();

// app.use(express.json());

// sanitize
// validate
const validateCredential = [
  body("username")
    .trim()
    .isLength({ min: 2 })
    .withMessage("username should be at least 5 characters"),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("password should be at least 5 characters"),
  validate,
];

const validateSignup = [
  ...validateCredential,
  body("name").trim().notEmpty().withMessage("name is missing"),
  body("email").isEmail().normalizeEmail().withMessage("invalid email"),
  body("url")
    .isURL()
    .withMessage("invalid URL")
    .optional({ nullable: true, checkFalsy: true }), // optional 항목이라고 명시
  validate,
];

// generate, store, and check token
router.post("/signup", validateSignup, authController.signUp);
router.post("/login", validateCredential, authController.login);
router.get("/me", isAuth, authController.me);

export default router;
