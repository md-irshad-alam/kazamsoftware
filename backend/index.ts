import dotenv from "dotenv";
dotenv.config();
import redis from "./redis/redis";
import connection from "./controller/db";
import http from "http";

import cors from "cors";
import express from "express";
import taskmodel from "./mode/taskmodel";
// import { socketIo } from "socket.io";
import { Server as socketIo } from "socket.io"; // Updated import for socket.io
const port = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const REDIS_KEY = process.env.TASK_KEY;
const io = new socketIo(server, {
  // Updated to use socketIo
  cors: {
    origin: "*", // You can specify the frontend URL here (e.g., http://localhost:3000)
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(express.static("public"));
app.use(cors());
connection();
io.on("connection", (socket: any) => {
  socket.on("add", async (item: any) => {
    try {
      const data = await redis.get(REDIS_KEY);
      let tasks = data ? JSON.parse(data) : [];
      tasks.push({ content: item.content, createdAt: new Date() });
      if (tasks.length > 40) {
        await taskmodel.insertMany(tasks);
        await redis.del(REDIS_KEY);
        console.log("flushed redis to mongodb");
        io.emit("tasksFlushed", tasks);
      } else {
        await redis.set(REDIS_KEY, JSON.stringify(tasks));
        console.log("📌 Task added to Redis");
      }
    } catch (error) {
      console.error("webSocket error", error);
    }
  });
});

app.get("/getAll", async (req: any, res: any) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const redisData = await redis.get(REDIS_KEY);
    const redisTask = redisData ? JSON.parse(redisData) : [];
    const redisTaskSorted = redisTask.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const mongoTasks = await taskmodel.find({}).sort({ createdAt: -1 });
    const allTasks = [...redisTaskSorted, ...mongoTasks];

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTasks = allTasks.slice(startIndex, endIndex);

    res.json({
      data: paginatedTasks,
      total: allTasks.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/post", (req: any, res: any) => {
  try {
    res.status(200).json({ message: "good" });
  } catch (error) {
    console.log(error);
    res.send({ message: "internal error " });
  }
});
server.listen(port, () => {
  try {
    console.log("server running!", port);
  } catch (error) {
    console.error("Error starting server:", error);
    throw new Error("Internal Error !");
  }
});
