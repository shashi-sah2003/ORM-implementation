const { SubTask } = require('../models');

exports.createSubTask = async (req, res) => {
  try {
    const { task_id } = req.body;
    const subTask = await SubTask.create({ task_id });
    res.json(subTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//Get all subtasks
exports.getAllUserSubTasks = async (req, res) => {
  try {
      // Extracting filter parameters
      const { task_id } = req.query;

      // Building filter conditions based on provided parameters
      const filterOptions = {};
      if (task_id) {
          filterOptions.task_id = task_id;
      }

      // Finding subtasks based on filters
      const subTasks = await SubTask.findAll({
          where: filterOptions
      });
      
      res.json(subTasks);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};


//Update subtask
  exports.updateSubTask = async (req, res) => {
      try {
        const { sub_task_id, status } = req.body;
        const subTask = await SubTask.findByPk(sub_task_id);

        if (!subTask) {
          return res.status(404).json({ message: 'Sub task not found' });
        }
        
        subTask.status = status;
        await subTask.save();
        res.json(subTask);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };


//Softdeletion subtask
  exports.deleteSubTask = async (req, res) => {
    try {
      const { sub_task_id } = req.body;
      const subTask = await SubTask.findByPk(sub_task_id);
      if (!subTask) {
        return res.status(404).json({ message: 'Sub task not found' });
      }
      await subTask.destroy();
      res.json({ message: 'Sub task deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };