const express = require('express');
const router = express.Router();
const subTaskController = require('../controller/subtaskController');

// Define routes
router.post('/subtask/create', subTaskController.createSubTask);
router.get('/subtasks', subTaskController.getAllUserSubTasks);
router.put('/subtask/update', subTaskController.updateSubTask);
router.delete('/subtask/delete', subTaskController.deleteSubTask);

module.exports = router;