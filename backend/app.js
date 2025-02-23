const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Authrouter = require('./auth/routes/auth');
const UserRoutes = require('./System/routes/system');
const ConnectionRoutes = require('./Connection/controllers/connection');
const HistoryRoutes = require('./History/controllers/history');
const AccountRoutes = require('./Account/controllers/account');
const SettingRoutes = require('./Settings/controllers/setting');
require('dotenv').config();

const db = require('./config/database.js');
const app = express();
app.use(cors());
const PORT = process.env.PORT || 8000;


// MiddlewareIQTBo3yO9155+
app.use(bodyParser.json());



// ใช้งาน Router
app.use("/", Authrouter);
app.use("/", UserRoutes);
app.use("/", ConnectionRoutes);
app.use("/", AccountRoutes);
app.use("/", HistoryRoutes);
app.use("/", SettingRoutes);


app.listen(PORT, '0.0.0.0', async() => {
    await db;
    console.log(`Server is running on http://localhost:${PORT}`);
});