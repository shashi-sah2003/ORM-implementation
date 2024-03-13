const express = require('express');
const db = require('./models');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/Taskroutes');
const subTaskRoutes = require('./routes/subTaskroutes');

const app = express();

app.use(bodyParser.json());

const port = 3000;

const ipaddress = "127.0.0.1";

// Use task routes
app.use('/', taskRoutes);
app.use('/',subTaskRoutes);

db.sequelize.sync().then((req) => {

    app.listen(port, ipaddress, () => {
        console.log(`Server is running on http://${ipaddress}:${port}`);

    });

});
