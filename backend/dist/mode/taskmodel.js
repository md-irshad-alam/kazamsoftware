"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
    content: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
const TaskModel = mongoose.model("task", taskSchema);
exports.default = TaskModel;
