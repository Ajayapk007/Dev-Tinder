const validator = require("validator");

const validateSignUp = (req) => {
  const { email, firstName, lastName, password } = req.body;

  if (!firstName || typeof firstName !== "string") {
    throw new Error("First name is required and must be a string");
  }
  if (firstName.length < 2 || firstName.length > 20) {
    throw new Error("First name should be between 2 to 20 characters");
  }
  if (!lastName || typeof lastName !== "string") {
    throw new Error("Last name is required and must be a string");
  }
  if (lastName.length < 2 || lastName.length > 20) {
    throw new Error("Last name should be between 2 to 20 characters");
  }
  if (!email || typeof email !== "string") {
    throw new Error("Email is required and must be a string");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Email not valid email");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "about",
    "skills",
    "age",
    "gender",
    "photoUrl",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  
  return isEditAllowed;
};

module.exports = {
  validateSignUp,
  validateEditProfileData,
};
