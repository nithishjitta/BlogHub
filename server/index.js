require("dotenv").config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { connectDB } = require('./connect');
const authRoutes = require('./routes/authRoute');
const app = express();
const cookiesParser = require('cookie-parser');

app.use(cors({
    origin: 'http://localhost:5173', // your frontend URL
    credentials: true,
}));
app.use(express.json());
app.use(cookiesParser());

connectDB(process.env.MONGO_URI);

app.use('/', authRoutes);

app.listen(process.env.PORT || 3100, () => {console.log(`Server is running on port ${process.env.PORT}`)});