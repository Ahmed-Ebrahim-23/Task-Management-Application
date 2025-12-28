const express = require('express')
const taskController = require('../controllers/task.controller');
const verifyJWT = require('../middlewares/verifyJWT');

const router = express.Router()

router.route('/')
    .get(verifyJWT, taskController.getAllTasks)
    .post(verifyJWT, taskController.createTask);

router.route('/:taskId')
    .get(taskController.getTaskById)
    .put(taskController.updateTask)
    .delete(taskController.deleteTask);

module.exports = router;

