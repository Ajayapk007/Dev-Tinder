const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");

const appRouter = require("./routes/authrouter");
const profile = require("./routes/profile");
const request = require("./routes/request");
const userRouter = require("./routes/user");


app.use(express.json());
app.use(cookieParser());
app.use('/', appRouter, profile, request, userRouter);

connectDB()
  .then(() => {
    console.log("connection to Database is successfull");
    app.listen(8080, () => {
      console.log("This server running on port no. 8080....");
    });
  })
  .catch((e) => {
    console.log("there is a problem in connecting to Database");
  });

