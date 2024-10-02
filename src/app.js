const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUp } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("invalid credentials ");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      //create JWT Token
      const token = await jwt.sign({ id: user.id }, "DEV@TINDER$343");

      //add token to cookies and send back response
      res.cookie("token", token);
      res.send("login successfully");
    } else {
      throw new Error("invalid credential ");
    }
  } catch (error) {
    res.status(404).send("Error: " + error.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const incomingCookies = req.cookies;
    const { token } = incomingCookies;
    if (!token) {
      throw new Error("invalid Token");
    }
    // Validation check
    const decoded = await jwt.verify(token, "DEV@TINDER$343");
    const { id } = decoded;
    
    const user = await User.findById(id);
    if (!user) {
      throw new Error("user not found");
    }
    res.send(user);
  } catch (error) {
    res.status(401).send("Error: "+ error.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const usersList = await User.find({});
    res.send(usersList);
  } catch (e) {
    res.status(404).send("not found");
  }
});

//user details
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      res.send("user not found");
    } else {
      res.send(user);
    }
  } catch (e) {
    res.status(404).send("something went worng");
  }
});

// update userinfo   or patch
app.patch("/user", async (req, res) => {
  const userObj = req.body;
  console.log(req.body);
  try {
    const ALLOWED_UPDATES = [
      "email",
      "firstName",
      "lastName",
      " about",
      "photoUrl",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(userObj).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update is not allowed");
    }
    if (userObj?.skills.length > 10) {
      throw new Error("Max 10 skills");
    }

    userObj?.skills.map((skill) => {
      if (skill.length > 20) {
        throw new Error("Max length of a specific skill is  20words");
      }
    });

    const user = await User.findOne({ email: userObj.email });
    const id = user.id;
    await User.findByIdAndUpdate(id, userObj, { runValidators: true });
    res.send("updated");
  } catch (e) {
    res.status(404).send("eeror " + e.message);
  }
});

//Delete User from database
app.delete("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.findOne({ email: userEmail });
    const id = user.id;
    if (!id) {
      res.send("no user Found");
    } else {
      await User.findByIdAndDelete(id);
      res.send("user is deleted succesfully");
    }
  } catch (error) {
    res.status(404).send("error occured");
  }
});

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
