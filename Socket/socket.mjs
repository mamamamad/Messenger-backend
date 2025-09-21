import { Server } from "socket.io";
import { log, getEnv } from "../core/utils.mjs";
import jwt from "jsonwebtoken";
import redis from "../core/redis.mjs";
import { messageQueue, MongoDb } from "./../globalMoudles.mjs";
export default async function initSocket(server) {
  const io = new Server(server, {
    path: "/chat",
    cors: {
      origin: [getEnv("APP_URL")],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.headers.authorization;
      if (!token) return next(new Error("Access denied"));
      const secretKey = getEnv("SECRET_KEY_JWT");

      let decoded;

      try {
        decoded = jwt.verify(token, secretKey);
      } catch (err) {
        if (err.name === "TokenExpiredError")
          return next(new Error("Token expired"));
        if (err.name === "JsonWebTokenError")
          return next(new Error("Malformed token"));
        if (err.name === "NotBeforeError")
          return next(new Error("Token not active yet"));
        return next(new Error("Invalid token"));
      }

      const base64Code = Buffer.from(decoded.email).toString("base64");

      let existRefreshToken = await redis.redis1.ftSearchUserTokenIdEmail(
        base64Code
      );
      log(existRefreshToken);

      if (!existRefreshToken || base64Code !== existRefreshToken.data.email) {
        return next(new Error("Invalid refresh token"));
      }

      socket.userEmail = decoded.email;
      next(); // allow connection
    } catch (error) {
      log(error);
      next(new Error("Internal server error"));
    }
  });

  io.on("connect", async (socket) => {
    log(`New user connected: ${socket.userEmail}`);

    socket.on("messageToAll", async (msg) => {
      const data = {
        id: "",
        from: socket.userEmail,
        to: "All",
        content: msg,
        type: "text",
        pin: false,
        replay: "",
      };

      const result = await messageQueue.addToQueue(JSON.stringify(data));

      io.emit("replay", { content: msg, user: socket.userEmail, type: "text" });
    });
    socket.on("ImageToAll", async (imageName) => {
      const data = {
        id: "",
        from: socket.userEmail,
        to: "All",
        content: imageName.msg,
        type: "image",
        pin: false,
        replay: "",
      };

      const result = await messageQueue.addToQueue(JSON.stringify(data));

      io.emit("replay", {
        Msg: imageName,
        user: socket.userEmail,
        type: "Image",
      });
    });

    socket.on("disconnect", () => {
      log(`❌ user disconnected: ${socket.userEmail}`);
    });
  });

  return io;
}
