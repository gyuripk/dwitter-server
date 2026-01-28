import dotenv from "dotenv";
dotenv.config();

function required(key, defaultValue = undefined) {
  // defaultValue = undefined : 이 parameter는 optional이라고 명시
  const value = process.env[key] || defaultValue;
  if (value == null) {
    // value가 undefined라면
    throw new Error(`Key ${key} is undefined!`);
  }
  return value;
}

// config라는 object를 export하기
export const config = {
  jwt: {
    // nested object
    secretKey: required("JWT_SECRET"),
    expiresInSec: parseInt(required("JWT_EXPIRES_IN_SECOND", 172800)),
    // integer 값인 경우는 parseInt로 숫자로 만들어줘야 에러 안남
  },
  bcrypt: { saltRounds: parseInt(required("BCRYPT_SALT_ROUNDS", 12)) },
  db: { host: required("MONGODB_URI") },
  port: parseInt(required("PORT", 8080)),
  cors: {
    allowedOrigin: required("CORS_ALLOW_ORIGIN"),
  },
};

// 그냥 .env파일에 정의하고 process.env.환경변수명 사용방법 => 문제점 2가지
// 1. process.env. -> 서버 시작후에 동적으로 환경변수 읽으므로 코드 작성시 환경변수에 어떤 것들 있는지 알 수 없음, 오타 날 확률 높음
// 2. env에 없는 환경변수를 코드에서 사용해도 에러없지만 사용시 실시간으로 동적 에러날 수 있음 -> 환경변수 정의했는지 여부 알 수가 없음
