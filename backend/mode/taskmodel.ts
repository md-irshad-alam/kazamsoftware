const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    content: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
const TaskModel = mongoose.model("task", taskSchema);

export default TaskModel;
