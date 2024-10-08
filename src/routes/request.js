const express = require("express");
const ConnectionRequest = require("../models/connecctionRequest");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user.id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      // check toUserId user exist or not
      const toUser = await User.findById(toUserId);
      if (!toUser) throw new Error("invailid credentials!!!");

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest)
        throw new Error("Request is in padding state");

      const statusAllowed = ["interested", "ignored"];
      const isAllowedStatus = statusAllowed.includes(status);

      if (!isAllowedStatus) throw new Error("invalid status type ");
      // console.log(toSendId)
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await connectionRequest.save();

      res.json({
        message: req.user.firstName + " " + status + " " + toUser.firstName,
      });
    } catch (error) {
      res.status(404).send(error.message);
    }
  }
);

requestRouter.post(
  "/resquest/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const {requestId, status} = req.params;
      const loginUser = req.user;
      const allwoedStatus =["accepted", "rejected"];
      if(!allwoedStatus.includes(status)) throw new Error("invalid status");
      
      const connecctionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loginUser._id,
        status:"interested",
      });
      if(!connecctionRequest) throw new Error("invalid request");
      
      connecctionRequest.status = status;
      await connecctionRequest.save();
      
      res.send(`${loginUser.firstName} ${status} request of ${connecctionRequest.firstName}`);

    } catch (error) {
      res.status(404).send(error.message)

    }
  }
);

module.exports = requestRouter;
