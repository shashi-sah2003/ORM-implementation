const { User, Task } = require('../models');

exports.createTask = async (req, res) => {
    try {
        // 1. Validate input parameters
        const { title, description, due_date } = req.body;
        if (!title || !description || !due_date) {
            return res.status(400).json({ message: 'Please provide title, description, and due date' });
        }

        // 2. Authenticate user using JWT
        const token = req.headers.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Missing token' });
        }
        const decoded = jwt.verify(token, 'your_secret_key');
        //const userId = decoded.userId;

        //3. Check if users table is empty

        const usersCount = await User.count();
        let userId;

        if (usersCount === 0) {
            // 4. If users table is empty, create a default user
            const defaultUser = await User.create({ phone_number: 'default', priority: '0' });
            userId = defaultUser.id;
        } else {
            // 5. Get the first user from the users table
            const firstUser = await User.findOne();
            userId = firstUser.id;
        }

        // 6. Create task and associate with user
        const task = await Task.create({ title, description, due_date, user_id: userId });
        res.json(task);
    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};


//Get all thw UserTasks
exports.getAllUserTasks = async (req, res) => {
    try {
        // Extracting filters from request query parameters
        const { priority, dueDate } = req.query;
        
        // Building filter conditions based on provided parameters
        const filterOptions = {};
        if (priority) {
            filterOptions.priority = priority;
        }
        if (dueDate) {
            filterOptions.dueDate = dueDate;
        }

        // Finding tasks based on filters
        const tasks = await Task.findAll({
            where: filterOptions
        });
        
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//update task

exports.updateTask = async (req, res) => {
    try {
        const { task_id, due_date, status } = req.body;
        const task = await Task.findByPk(task_id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Validate status
        if (status !== "TODO" && status !== "DONE") {
            return res.status(400).json({ message: 'Invalid status. Status must be either "TODO" or "DONE".' });
        }

        // Validate due date format
        if (due_date && !moment(due_date, 'YYYY-MM-DD', true).isValid()) {
            return res.status(400).json({ message: 'Invalid due date format. Please provide date in YYYY-MM-DD format.' });
        }

        // Update task properties
        if (due_date) task.due_date = due_date;
        if (status) task.status = status;

        await task.save();
        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//soft deletion task

exports.deleteTask = async (req, res) => {
    try {
        const { task_id } = req.body;

        // Validate task_id
        if (!task_id) {
            return res.status(400).json({ message: 'Task ID is required' });
        }

        const task = await Task.findByPk(task_id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.destroy();
        res.json({ message: 'Task deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
