import dotenv from "dotenv";
dotenv.config();
import redis from "./redis/redis";
import connection from "./controller/db";
import http from "http";
import cors from "cors";
import express from "express";
import taskmodel from "./mode/taskmodel";
import getAllController from "./controller/getAll";
import mqtt from "mqtt";

const port = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);
const REDIS_KEY = process.env.TASK_KEY || "tasks";

// MQTT setup
const MQTT_TOPIC_NEW_TASK = "task/new"; // topic to receive new tasks
const client = mqtt.connect("mqtt://broker.hivemq.com");

// Handle incoming MQTT messages
client.on("message", async (topic, message) => {
  if (topic === MQTT_TOPIC_NEW_TASK) {
    try {
      const item = JSON.parse(message.toString());
      const data = await redis.get(REDIS_KEY);
      let tasks = data ? JSON.parse(data) : [];
      tasks.push({ content: item.content, createdAt: new Date() });

      if (tasks.length > 40) {
        await taskmodel.insertMany(tasks);
        await redis.del(REDIS_KEY);
        console.log("✅ Flushed Redis to MongoDB");
      } else {
        // await redis.set(REDIS_KEY, JSON.stringify(tasks));
        console.log("📌 Task added to Redis");
      }
    } catch (error) {
      console.error("❌ Error processing MQTT message:", error);
    }
  }
});

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

app.get("/fetchAllTasks", getAllController);

server.listen(port, () => {
  try {
    connection();
    console.log(`🚀 Server running on port ${port}`);
  } catch (error) {
    console.error("Error starting server:", error);
    throw new Error("Internal Error !");
  }
});
