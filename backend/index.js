const dotenv = require("dotenv");
dotenv.config();
const connection = require("./controller/db");
const http = require("http");
const express = require("express");
const cors = require("cors");
const redis = require("./redis/redis");
const taskmodel = require("./mode/taskmodel");
const socketIo = require("socket.io");
const port = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const REDIS_KEY = process.env.TASK_KEY;
const io = socketIo(server, {
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
io.on("connection", (socket) => {
  console.log("client connected");
  socket.on("add", async (item) => {
    try {
      console.log("item", item);
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

app.get("/getAll", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const redisData = await redis.get(REDIS_KEY);
    const redisTask = redisData ? JSON.parse(redisData) : [];
    const redisTaskSorted = redisTask.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
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

app.post("/post", (req, res) => {
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
