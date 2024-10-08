const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connecctionRequest");
const { connections } = require("mongoose");

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    // get the all pending connection request 
    try {
        const user = req.user;
        const allRequest = await ConnectionRequest.find ({
            toUserId: user._id,
            status : "interested"
        }).populate("fromUserId", "firstName lastName photoURL skills gender age");
    res.send(allRequest)
        
    } catch (error) {
        res.send(error.message);
    }

});

userRouter.get("/user/connection", userAuth, async(req,res)=>{
    const loggedInUser = req.user;
    try {
        const allconnection = await ConnectionRequest.find({
            $or:[
                {toUserId: loggedInUser._id, status:"accepted" },
                {fromUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", "firstName lastName skills about photoUrl")
        .populate("toUserId", "firstName lastName")
        res.json({
            message:{
                inof: allconnection,
            },
        })
    } catch (error) {
        res.status(404).send(error.message);
    } 
})

module.exports = userRouter;
