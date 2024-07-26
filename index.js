const express = require("express");
const app = express();
const port = 3500;
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');

connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api/employer" , require('./routes/employerRoute'))
app.use("/api/permission" , require('./routes/permission'))
app.use("/api/expenses" , require('./routes/expensesRoute'))
app.use("/api/mediator" , require('./routes/mediatorRoutes'))
app.use("/api/client" , require('./routes/clientRoute'))
app.use("/api/meeting" , require('./routes/meetingRoutes'))
app.use("/api/invoicse" , require('./routes/AddinvoicsRoute'))
app.use("/api/projects" , require('./routes/ProjectRoute'))
app.use('/api/missions' ,require('./routes/missionRoutes'))
app.use('/api/auth', require('./routes/userRouter'));

app.all("*", (req, res) => {
  res.status(404).send("404 Not Found");
});

mongoose.connection.once('open', () => {
  console.log("connected to db");
  http.listen(port, () => {
    console.log("app listening on port 3500");
  });
});

mongoose.connection.on('error', (error) => {
  console.log(error);
});