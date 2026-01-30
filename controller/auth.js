import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as userRepository from "../data/auth.js";
import { config } from "../config.js";

export async function signUp(req, res) {
  const { username, password, name, email, url } = req.body;
  const found = await userRepository.findByUsername(username);
  // check if the user exists in database
  if (found) {
    return res.status(409).json({ message: `${username} already exists` });
  }

  // if signup success -> generate token
  const hashedPwd = await bcrypt.hash(password, config.bcrypt.saltRounds);

  const userId = await userRepository.createUser({
    username,
    password: hashedPwd,
    name,
    email,
    url,
  });

  const token = createJwtToken(userId);
  setToken(res, token); // HTTP-ONLY 🍪 for browser client
  res.status(201).json({ token, username }); // body에 token 전달 for non-browser clients
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
  setToken(res, token);
  res.status(200).json({ username, token });
}

export async function logout(req, res) {
  res.cookie("token", "");
  res.status(200).json({ message: "User has been logged out" });
}

// 내부에서만 쓰는 함수이므로 export 붙이지 X
// async로 동작 X
function createJwtToken(id) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}

function setToken(res, token) {
  const options = {
    maxAge: config.jwt.expiresInSec * 1000, // milli sec
    httpOnly: true,
    sameSite: "none", // 클라이언트와 서버가 다른 ip(domain)이어도 동작 가능: 'none'
    secure: true,
  };
  res.cookie("token", token, options); // HTTP-ONLY 🍪
}

export async function me(req, res, next) {
  // middleware function
  const user = await userRepository.findById(req.userId);
  if (!user) {
    res.status(400).json({ message: "User not found" });
  }
  res.status(200).json({ token: req.token, username: user.username });
}

export async function csrfToken(req, res, next) {
  const csrfToken = await generateCSRFToken();
  res.status(200).json({ csrfToken }); // body에 csrfToken 보냄 -> 브라우저 network>response 탭에서 토큰 확인가능
}

async function generateCSRFToken() {
  return bcrypt.hash(config.csrf.plainToken, 1); // generate random unique token
  // salt round -> 연산 비용(난이도)을 1로 설정하여, 가장 빠르게 랜덤 해시(토큰) 생성
}
