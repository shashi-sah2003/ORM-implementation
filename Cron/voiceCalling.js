const cron = require('node-cron');
const twilio = require('twilio');
const { Task } = require('../models/kTask');
const { User } = require('../models/jUser');

// Create a Twilio client with your Twilio credentials
const twilioClient = twilio('YOUR_TWILIO_ACCOUNT_SID', 'YOUR_TWILIO_AUTH_TOKEN');

// Define the cron job to run periodically
cron.schedule('0 0 * * *', async () => { // Runs daily at midnight
    try {
        // Find all overdue tasks along with associated user information, ordered by user priority
        const overdueTasks = await Task.findAll({
            where: {
                due_date: { [Sequelize.Op.lt]: new Date() }, // Due date is less than current date
                status: 'TODO' // Only consider tasks that are still pending
            },
            include: [{
                model: User // Include the associated user information
            }],
            order: [[User, 'priority', 'ASC'], ['due_date', 'ASC']] // Order by user priority and then by due date ascending
        });

        let previousUserAnswered = true; // Flag to track if the previous user answered the call

        // Iterate over each overdue task
        for (const task of overdueTasks) {
            const user = task.User;
            const phoneNumber = user.phone_number;

            // Call the user only if the previous user did not answer the call
            if (!previousUserAnswered) {
                console.log('Skipping call to user with phone number:', phoneNumber, 'as previous user answered');
                continue; // Move to the next user
            }

            // Call the user using Twilio
            try {
                await twilioClient.calls.create({
                    twiml: '<Response><Say>Your task with title ' + task.title + ' is overdue. Please take action immediately.</Say></Response>',
                    to: phoneNumber,
                    from: 'YOUR_TWILIO_PHONE_NUMBER'
                });
                console.log('Call placed to user with phone number:', phoneNumber);
                previousUserAnswered = true; // Set flag to true as call was successful
            } catch (error) {
                console.error('Error placing call to user with phone number:', phoneNumber, error);
                previousUserAnswered = false; // Set flag to false as call failed
            }
        }
    } catch (error) {
        console.error('Error processing overdue tasks:', error);
    }
});
