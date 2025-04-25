const dotenv = require("dotenv");
dotenv.config();

const Redis = require("ioredis");

// Create a new Redis client
const redis = new Redis({
  host: "redis-12675.c212.ap-south-1-1.ec2.cloud.redislabs.com",
  port: "12675",
  username: "default",
  password: "dssYpBnYQrl01GbCGVhVq2e4dYvUrKJB",
  connectTimeout: 10000,
});

// Test the Redis connection
redis
  .ping()
  .then(() => {
    console.log("Connected to Redis!");
  })
  .catch((err) => {
    console.error("Error connecting to Redis:", err);
  });

module.exports = redis;
