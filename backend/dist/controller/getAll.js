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
const redis_1 = __importDefault(require("../redis/redis"));
const taskmodel_1 = __importDefault(require("../mode/taskmodel"));
const getAllController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get page and limit from query params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const redisData = yield redis_1.default.get(process.env.TASK_KEY);
        const redisTask = redisData ? JSON.parse(redisData) : [];
        const redisTaskSorted = redisTask.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const mongoTasks = yield taskmodel_1.default.find({}).sort({ createdAt: -1 });
        const allTasks = [...redisTaskSorted, ...mongoTasks];
        if (allTasks.length === 0) {
            return res.json({
                data: [],
                total: 0,
                currentPage: page,
                totalPages: 0,
                source: "combined",
            });
        }
        const total = allTasks.length;
        // Calculate pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedTasks = allTasks.slice(startIndex, endIndex);
        res.json({
            data: paginatedTasks,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            source: "combined",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.default = getAllController;
