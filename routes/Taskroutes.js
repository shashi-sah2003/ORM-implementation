const express = require('express');
const router = express.Router();
const tasksController = require('../controller/taskController');

// Define routes
router.post('/task/create', tasksController.createTask);
router.get('/tasks', tasksController.getAllUserTasks);
router.put('/task/update', tasksController.updateTask);
router.delete('/task/delete', tasksController.deleteTask);

module.exports = router;