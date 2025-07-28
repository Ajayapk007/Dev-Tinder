const express = require("express");
const User = require("../models/user");
const { validateSignUp } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

const appRouter = express.Router();

appRouter.post("/signup", async (req, res) => {
    try {
      // validation of data first thing
      validateSignUp(req);
      //encrypt password
      const { firstName, lastName, email, password } = req.body;
      const passowrdHash = await bcrypt.hash(password, 10);
      //creating a new user
      const user = new User({
        firstName,
        lastName,
        email,
        password: passowrdHash,
      });
      await user.save();
      res.send("user added to db");
    } catch (e) {
      res.status(404).send("error saving the user: " + e.message);
    }
  });

appRouter.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!validator.isEmail(email)) {
        throw new Error("invalid credentials ");
      }
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("invalid credentials");
      }
      const isPasswordValid = await user.validatePassowrd(password); 
  
      if (isPasswordValid) {
        //create JWT Token
        const token = await user.getJWT();
  
        //add token to cookies and send back response
        res.cookie("token", token);
        res.send(user);
      } else {
        throw new Error("invalid credential ");
      }
    } catch (error) {
      res.status(404).send("Error: " + error.message);
    }
  });

appRouter.post("/logout", (req, res) =>{
  res.cookie("token", null, {
    expires: new Date(Date.now())
  }).send("User Logouted")

})
   
  
  module.exports = appRouter;