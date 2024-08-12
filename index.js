const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authMW = require("./middleware/authenticationMW");
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
  console.log(req.url, req.method);
  next();
});

//endpoint middelware
// connectDB();
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use("/api", require("./routes/authRoute"));
server.use(authMW);
server.use("/api/expenses", require("./routes/expensesRoute"));
server.use("/api/chats", require("./routes/chatRoute"));
server.use("/api/notifications", require("./routes/notificationRoute"));
server.use("/api/messages", require("./routes/messageRoute"));
server.use("/api/customers", require("./routes/customerRoute"));
server.use("/api/meetings", require("./routes/meetingRoutes"));
server.use("/api/users", require("./routes/userRoute"));
server.use("/api/roles", require("./routes/roleRoute"));
server.use("/api/invoices", require("./routes/invoiceRoute"));
server.use("/api/projects", require("./routes/ProjectRoute"));
server.use("/api/missions", require("./routes/missionRoutes"));

// Not Found MiddleWare

server.use((req, res, next) => {
  res.status(404).json({ data: "Not Found" });
});

//Error Middleware
server.use((error, req, res, next) => {
  res.status(500).json({ data: `From Error MW : ${error}` });
});
