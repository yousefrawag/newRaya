const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
// const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// setting up server
const server = express();
const port = process.env.Port || process.env.LOCALPORT;
mongoose
  .connect(process.env.MONGOOOSE_URL)
  .then(() => {
    console.log("conectect to DB server .......");
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}.....`);
    });
  })
  .catch((err) => console.log(`DB issue ..... ${err}`));

//logging middelware
server.use((req, res, next) => {
  console.log(request.url, request.method);
  next();
});

//endpoint middelware
// connectDB();
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use("/api/employer", require("./routes/employerRoute"));
server.use("/api/permission", require("./routes/permission"));
server.use("/api/expenses", require("./routes/expensesRoute"));
server.use("/api/mediator", require("./routes/mediatorRoutes"));
server.use("/api/client", require("./routes/clientRoute"));
server.use("/api/meeting", require("./routes/meetingRoutes"));
server.use("/api/invoicse", require("./routes/AddinvoicsRoute"));
server.use("/api/projects", require("./routes/ProjectRoute"));
server.use("/api/missions", require("./routes/missionRoutes"));
server.use("/api/auth", require("./routes/userRouter"));

// Not Found MiddleWare

server.use((req, res, next) => {
  res.status(404).json({ data: "Not Found" });
});

//Error Middleware
server.use((error, req, res, next) => {
  res.status(500).json({ data: `From Error MW : ${error}` });
});

// server.all("*", (req, res) => {
//   res.status(404).send("404 Not Found");
// });

// mongoose.connection.once('open', () => {
//   console.log("connected to db");
//   http.listen(port, () => {
//     console.log("server listening on port 3500");
//   });
// });

// mongoose.connection.on("error", (error) => {
//   console.log(error);
// });
