const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 20,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong");
        }
      },
    },
    gender: {
      type: String,
      lowercae: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value.toLowerCase())) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    about: {
      type: String,
    },
    skills: {
      type: [String],
    },
    photoURL: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Photo url is not correct");
        }
      },
    },
    postURL: {
      type: [String],
      default: [
        "https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png",
      ],
      validate: {
        validator: function (urls) {
          return urls.every((url) => validator.isURL(url));
        },
        message: (props) =>
          `One or more items in ${props.value} are not valid URLs.`,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ id: user.id }, "DEV@TINDER$343", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassowrd = async function (password) {
  const user = this;

  return await bcrypt.compare(password, user.password);
};

module.exports = mongoose.model("User", userSchema);
