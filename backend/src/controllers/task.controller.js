const prisma = require('../config/prisma');
const { TaskStatus } = require('@prisma/client');

const createTask = async (req, res) => {
    try {
        const userId = req.currentUser;
        const { title, description } = req.body;
        
        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                userId
            }
        });
        
        res.status(201).json({
            status: "success",
            data: newTask,
            message: "Task created successfully"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            data: null,
            message: "Internal Server Error"
        });
        console.error(error.message);
    }
}

const getAllTasks = async (req, res) => {
    try {
        const userId = req.currentUser;
        
        const tasks = await prisma.task.findMany({
            where: { userId }
        });
        
        res.status(200).json({
            status: "success",
            data: tasks,
            message: "Tasks retrieved successfully"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            data: null,
            message: "Internal Server Error"
        });
        console.error(error.message);
    }
}

const getTaskById = async (req, res) => {
    try {
        const { taskId } = req.params;
        
        const task = await prisma.task.findUnique({
            where: { id: parseInt(taskId) }
        });
        
        if (!task) {
            return res.status(404).json({
                status: "fail",
                data: null,
                message: "Task not found"
            });
        }
        
        res.status(200).json({
            status: "success",
            data: task,
            message: "Task retrieved successfully"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            data: null,
            message: "Internal Server Error"
        });
        console.error(error.message);
    }
}

const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, status } = req.body;
        
        // Check if task exists
        const task = await prisma.task.findUnique({
            where: { id: parseInt(taskId) }
        });
        
        if (!task) {
            return res.status(404).json({
                status: "fail",
                data: null,
                message: "Task not found"
            });
        }

        // Check if status is valid 
        if (!Object.values(TaskStatus).includes(status)) {
            return res.status(400).json({
                status: "fail",
                data: null,
                message: "Invalid task status"
            });
        }

        const updatedTask = await prisma.task.update({
            where: { id: parseInt(taskId) },
            data: {
                title,
                description,
                status
            }
        });
        
        res.status(200).json({
            status: "success",
            data: updatedTask,
            message: "Task updated successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            data: null,
            message: "Internal Server Error"
        });
        console.error(error.message);
    }
}

const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        // Check if task exists
        const task = await prisma.task.findUnique({
            where: { id: parseInt(taskId) }
        });

        if (!task) {
            return res.status(404).json({
                status: "fail",
                data: null,
                message: "Task not found"
            });
        }

        const deletedTask = await prisma.task.delete({
            where: { id: parseInt(taskId) }
        });
        
        res.status(200).json({
            status: "success",
            data: null,
            message: "Task deleted successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            data: null,
            message: "Internal Server Error"
        });
        console.error(error.message);
    }
}

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
};