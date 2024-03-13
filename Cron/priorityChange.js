const cron  = require('node-cron');
const Task = require('../models/kTask');

cron.schedule('0 0 * * *', async () => {
    try {
        const tasks = await Task.findAll();

        for (const task of tasks) {
            const dueDate = new Date(task.due_date);
            const today = new Date();
            const diffTime = dueDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                task.priority = 0;
            } else if (diffDays >= 1 && diffDays <= 2) {
                task.priority = 1;
            } else if (diffDays >= 3 && diffDays <= 4) {
                task.priority = 2;
            } else {
                task.priority = 3;
            }

            await task.save();
        }

        console.log('Task priorities updated successfully.');
    } catch (error) {
        console.error('Error updating task priorities:', error);
    }
});

