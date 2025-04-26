import * as dotenv from "dotenv";
dotenv.config();

const Redis = require("ioredis");

const redisClient = new Redis({
  host: process.env.Host,
  port: process.env.Port,
  username: "default",
  password: process.env.Password,
  connectTimeout: 10000,
});
// Test the Redis connection
redisClient
  .ping()
  .then(() => {
    console.log("Connected to Redis!");
  })
  .catch((err: Error) => {
    console.error("Error connecting to Redis:", err);
  });
export default redisClient;
