import express, { json } from "express";
import * as userRepository from "../data/auth.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.JWT_SECRET;

// TODO: Make it secure!
const jwtSecretKey = secret;
const jwtExpiresInDays = "2d";
const bcryptSaltRounds = 12;

const app = express();
app.use(json);

export async function signUp(req, res) {
  const { username, password, name, email, url } = req.body;
  const found = await userRepository.findByUsername(username);
  // check if the user exists in database
  if (found) {
    return res.status(409).json({ message: `${username} already exists` });
  }

  // if signup success -> generate token
  const hashedPwd = await bcrypt.hash(password, bcryptSaltRounds);
  console.log(hashedPwd);

  const userId = await userRepository.createUser({
    username,
    password: hashedPwd,
    name,
    email,
    url,
  });

  // users.push(newUser);
  const token = createJwtToken(userId);
  res.status(201).json({ token, username });
}
export async function login(req, res) {
  // if the user is verified
  const { username, password } = req.body;
  const user = await userRepository.findByUsername(username);

  if (!user) {
    return res.status(401).json({ message: "invalid user or password" });
  }
  const isValidPwd = await bcrypt.compare(password, user.password);
  if (!isValidPwd) {
    return res.status(401).json({ message: "invalid user or password" });
  }
  const token = createJwtToken(user.id);
  res.status(200).json({ username, token });
}

// 내부에서만 쓰는 함수이므로 export 붙이지 X
// async로 동작 X
function createJwtToken(id) {
  return jwt.sign({ id }, jwtSecretKey, { expiresIn: jwtExpiresInDays });
}

export async function me(req, res, next) {
  // middleware function
  const user = await userRepository.findById(req.userId);
  if (!user) {
    res.status(400).json({ message: "User not found" });
  }
  res.status(200).json({ token: req.token, username: user.username });
}
