const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Task = sequelize.define('Task', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        due_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        priority: {
            type: DataTypes.ENUM('0', '1', '2', '3'),
            default: '0'
        },
        status: {
            type: DataTypes.ENUM('TODO', 'IN_PROGRESS', 'DONE'),
            defaultValue: 'TODO'
        }
    },
        {
            paranoid: true,
            underscored: true
        });

    // Define a hook to update the task status based on subtask completion
    Task.addHook('afterUpdate', 'updateTaskStatus', async (task, options) => {
        const SubTask = sequelize.models.SubTask;
        const subTasksCount = await SubTask.count({
            where: {
                task_id: task.id,
                status: '1' // Assuming status "1" represents completed subtasks
            }
        });

        if (subTasksCount === 0) {
            task.status = 'TODO';
        } else if (subTasksCount < await SubTask.count({ where: { task_id: task.id } })) {
            task.status = 'IN_PROGRESS';
        } else {
            task.status = 'DONE';
        }

        // Update the status
        await task.save({ transaction: options.transaction });
    });

    return Task;

}

