const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connecctionRequest");
const User = require("../models/user");
const { ObjectId } = require('mongoose').Types;

const userRouter = express.Router();
const USER_SAFE_DATA = "_id firstName lastName skills about photoUrl";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  // get the all pending connection request
  try {
    const user = req.user;
    const allRequest = await ConnectionRequest.find({
      toUserId: user._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName photoURL skills gender age");
    res.send(allRequest);
  } catch (error) {
    res.send(error.message);
  }
});

userRouter.get("/user/connection", userAuth, async (req, res) => {
  const loggedInUser = req.user;
  try {
    const allconnection = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    res.json({
      message: {
        inof: allconnection,
      },
    });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    //user should see other all cards but not its own, connections, interested and ignored
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 31 ? 31:limit;
    const skiped = (page - 1)*limit;
    
    const connectionRequests = await ConnectionRequest.find({
      $and: [
        {
          $or: [
            { toUserId: loggedInUser._id },
            { fromUserId: loggedInUser._id },
          ],
        },
        {
          $or: [{ status: "accepted" }, { status: "rejected" }, {status: "interested"}],
        },
      ],
    }).select("fromUserId toUserId");
    const hideUsersFromFeed = new Set();

    connectionRequests.forEach(element => {
        hideUsersFromFeed.add(element.fromUserId.toString());
        hideUsersFromFeed.add(element.toUserId.toString());
    });

    const targetAge = loggedInUser.age;
    const feed = await User.aggregate([
      {
        $match: {
          $and: [
            { _id: { $nin: Array.from(hideUsersFromFeed).map(id => new ObjectId(id)) } },
            { _id: { $ne: loggedInUser._id } }
          ]
        }
      },
      
      {
        $addFields: {
          ageDifference: { $abs: { $subtract: ["$age", targetAge] } }
        }
      },
      {
        $sort: { ageDifference: 1, age: 1 }
      }
    ]).skip(skiped).limit(limit);

    const data = feed.map(user => {
      const userInfo = {};
      const fields = USER_SAFE_DATA.split(' '); 
  
      fields.forEach(field => {
          userInfo[field] = user[field]; 
      });
  
      return userInfo; 
  });

    res.send(data);
  } catch (error) {
    res.status(404).send(error.message);
  }
  
});
module.exports = userRouter;
