"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redis_1 = __importDefault(require("./redis/redis"));
const db_1 = __importDefault(require("./controller/db"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const taskmodel_1 = __importDefault(require("./mode/taskmodel"));
// import { socketIo } from "socket.io";
const socket_io_1 = require("socket.io"); // Updated import for socket.io
const port = process.env.PORT || 4000;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const REDIS_KEY = process.env.TASK_KEY;
const io = new socket_io_1.Server(server, {
  // Updated to use socketIo
  cors: {
    origin: "*", // You can specify the frontend URL here (e.g., http://localhost:3000)
    methods: ["GET", "POST"],
  },
});
app.use(express_1.default.json());
app.use(express_1.default.static("public"));
app.use((0, cors_1.default)());
(0, db_1.default)();
io.on("connection", (socket) => {
  socket.on("add", (item) =>
    __awaiter(void 0, void 0, void 0, function* () {
      try {
        const data = yield redis_1.default.get(REDIS_KEY);
        let tasks = data ? JSON.parse(data) : [];
        tasks.push({ content: item.content, createdAt: new Date() });
        if (tasks.length > 40) {
          yield taskmodel_1.default.insertMany(tasks);
          yield redis_1.default.del(REDIS_KEY);
          console.log("flushed redis to mongodb");
          io.emit("tasksFlushed", tasks);
        } else {
          yield redis_1.default.set(REDIS_KEY, JSON.stringify(tasks));
          console.log("📌 Task added to Redis");
        }
      } catch (error) {
        console.error("webSocket error", error);
      }
    })
  );
});

app.get("/getAll", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const redisData = yield redis_1.default.get(REDIS_KEY);
      const redisTask = redisData ? JSON.parse(redisData) : [];
      const redisTaskSorted = redisTask.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const mongoTasks = yield taskmodel_1.default
        .find({})
        .sort({ createdAt: -1 });
      const allTasks = [...redisTaskSorted, ...mongoTasks];

      res.json({
        data: allTasks,
        total: allTasks.length,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "server error" });
    }
  })
);

server.listen(port, () => {
  try {
    console.log("server running!", port);
  } catch (error) {
    console.error("Error starting server:", error);
    throw new Error("Internal Error !");
  }
});
