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
const taskmodel = mongoose.model("task", taskSchema);
module.exports = taskmodel;
