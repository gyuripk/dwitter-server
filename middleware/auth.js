import jwt from "jsonwebtoken";
import * as userRepository from "../data/auth.js";
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.JWT_SECRET;

const AUTH_ERROR = { message: "Authentication Error" };

export const isAuth = async (req, res, next) => {
  // middleware function
  const authHeader = req.get("Authorization");
  if (!(authHeader && authHeader.startsWith("Bearer "))) {
    // auth헤더가 없거나 Bearer로 시작하지 않는 경우
    return res.status(401).json(AUTH_ERROR);
  }
  const token = authHeader.split(" ")[1];

  // TODO: Make it secure!
  jwt.verify(token, secret, async (error, decoded) => {
    // ?? async 왜 붙임?
    if (error) {
      return res.status(401).json(AUTH_ERROR);
    }
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      return res.status(401).json(AUTH_ERROR);
    }

    req.userId = user.id; // register req.customData
    // 다른 콜백함수,미들웨어에서 동일하게 계속 접근해야하는 데이터의 경우
    // req 객체에 custom data인 userId 등록해두기
    // 요청부터 미들웨어 응답까지 쭉 필요한 데이터의 경우 req객체에 등록해 계속 전달함
    next();
  });
};
