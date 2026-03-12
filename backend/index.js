const express = require('express');
const connectDB = require('./Config/db');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const fs = require('fs');
const bot = require('./utilities/telegram_bot');

const authRouter = require('./Routes/authRoute');
const studentRouter = require('./Routes/studentRoute');
const attendanceRouter = require('./Routes/attendanceRoute');

dotenv.config();

const app = express();

const logDirectory = path.join(__dirname, "logs");

// ensure log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// create a write stream (append mode)
const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, "access.log"),
  { flags: "a" }
);

// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/student', studentRouter);
app.use('/api/attendance', attendanceRouter);

bot.launch();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});