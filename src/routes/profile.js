const express = require("express");
const User = require("../models/user");
const {userAuth} = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
      const user = req.user;
      res.send(user); 
    } catch (error) {
      res.status(401).send("Error: "+ error.message);
    }
  });

profileRouter.patch("/profile/edit", userAuth, async (req, res) =>{
    try {
      if(!validateEditProfileData(req)) {
        throw new Error("Invalid Edit Request");
      }
      
      const loggedInUser = req.user;

      Object.keys(req.body).forEach(key => (loggedInUser[key] = req.body[key]));

     await loggedInUser.save();

      res.send("Data successfully updated");
        
    } catch (error) {
        res.status(404).send("Error: " + error.message);
    }
})

profileRouter.patch("/profile/forgotpassword", userAuth, async (req, res) => {
  try {
      const {oldPassword, newPassword} = req.body;
      const loggedInUser = req.user;
      const isPasswordMatched = await bcrypt.compare(oldPassword, loggedInUser.password);

      if (!isPasswordMatched) {
          throw new Error("old password is wrong");
      } 
      loggedInUser["password"] = await bcrypt.hash(newPassword, 10);
      loggedInUser.save();
      res.send("Password changed successfully: do not share it")
      
  } catch (error) {
      res.status(500).send( error.message );
  }
});

module.exports = profileRouter;