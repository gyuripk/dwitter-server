import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

// export 안해서 외부에서 이 클래서 사용불가
class Socket {
  constructor(server) {
    // create socket
    this.io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    // check token
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }
      jwt.verify(token, config.jwt.secretKey, (error, decoded) => {
        if (error) {
          return next(new Error("Authentication error"));
        }
        next();
      });
    });

    this.io.on("connection", (socket) => {
      console.log("Socket client connected");
    });
  }
}

// 싱글톤 구현
// 객체지향 프로그래밍 언어에서는 클래스 내부에서
// 생성자를 private하게 만들고
// 이것 생성할 수 있는 factory 함수(static) 만들면 됨
// But 자바스크립트 문법으로는 이렇게 못함
// 타입스크립트는 이렇게 가능

// 예전 방식: 모듈 활용해서 이 클래스를 한번만 만듬
// getSocketIO호출해 socket instance 사용
let socket;
export function initSocket(server) {
  if (!socket) {
    socket = new Socket(server);
  }
}
export function getSocketIO() {
  if (!socket) {
    throw new Error("Please call init first");
  }
  return socket.io; // socket instance 반환
}
