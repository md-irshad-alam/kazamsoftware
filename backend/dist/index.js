"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
const getAll_1 = __importDefault(require("./controller/getAll"));
const mqtt_1 = __importDefault(require("mqtt"));
const port = process.env.PORT || 4000;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const REDIS_KEY = process.env.TASK_KEY || "tasks";
// MQTT setup
const MQTT_TOPIC_NEW_TASK = "task/new"; // topic to receive new tasks
const client = mqtt_1.default.connect("mqtt://broker.hivemq.com");
// Handle incoming MQTT messages
client.on("message", (topic, message) => __awaiter(void 0, void 0, void 0, function* () {
    if (topic === MQTT_TOPIC_NEW_TASK) {
        try {
            const item = JSON.parse(message.toString());
            const data = yield redis_1.default.get(REDIS_KEY);
            let tasks = data ? JSON.parse(data) : [];
            tasks.push({ content: item.content, createdAt: new Date() });
            if (tasks.length > 40) {
                yield taskmodel_1.default.insertMany(tasks);
                yield redis_1.default.del(REDIS_KEY);
                console.log("✅ Flushed Redis to MongoDB");
            }
            else {
                // await redis.set(REDIS_KEY, JSON.stringify(tasks));
                console.log("📌 Task added to Redis");
            }
        }
        catch (error) {
            console.error("❌ Error processing MQTT message:", error);
        }
    }
}));
app.use(express_1.default.json());
app.use(express_1.default.static("public"));
app.use((0, cors_1.default)());
app.get("/fetchAllTasks", getAll_1.default);
server.listen(port, () => {
    try {
        (0, db_1.default)();
        console.log(`🚀 Server running on port ${port}`);
    }
    catch (error) {
        console.error("Error starting server:", error);
        throw new Error("Internal Error !");
    }
});
