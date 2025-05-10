import dotenv from "dotenv";
dotenv.config();
import redis from "../redis/redis";
import taskmodel from "../mode/taskmodel";
const getAllController = async (req: any, res: any) => {
  try {
    // Get page and limit from query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const redisData = await redis.get(process.env.TASK_KEY);
    const redisTask = redisData ? JSON.parse(redisData) : [];
    const redisTaskSorted = redisTask.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const mongoTasks = await taskmodel.find({}).sort({ createdAt: -1 });

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
  } catch (error) {
    console.error("Error in getAllController:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export default getAllController;
