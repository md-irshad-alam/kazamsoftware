import dotenv from "dotenv";
dotenv.config();
import redis from "./redis/redis";
import connection from "./controller/db";
import http from "http";
import cors from "cors";
import express from "express";
import taskmodel from "./mode/taskmodel";
import { Server as socketIo } from "socket.io";
import getAllController from "./controller/getAll";
const port = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);
const REDIS_KEY = process.env.TASK_KEY;

const io = new socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

// db connection

// scoket connection

io.on("connection", (socket: any) => {
  socket.on("add", async (item: any) => {
    try {
      // redis connection

      const data = await redis.get(REDIS_KEY);
      let tasks = data ? JSON.parse(data) : [];

      tasks.push({ content: item.content, createdAt: new Date() });
      if (tasks.length > 40) {
        await taskmodel.insertMany(tasks);
        await redis.del(REDIS_KEY);
        console.log("flushed redis to mongodb");
      } else {
        await redis.set(REDIS_KEY, JSON.stringify(tasks));
        console.log("📌 Task added to Redis");
      }
    } catch (error) {
      console.error("webSocket error", error);
    }
  });
});

app.get("/api/getAll", getAllController);

server.listen(port, () => {
  try {
    connection();
    console.log("server running!", port);
  } catch (error) {
    console.error("Error starting server:", error);
    throw new Error("Internal Error !");
  }
});
