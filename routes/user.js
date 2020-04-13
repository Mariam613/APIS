const express = require("express");
const router = express.Router(); //create router
const { check } = require("express-validator");

const User = require("../models/user");
const authenticationMiddleWare = require("../middlewares/authentication");
const validationMidddleware = require("../middlewares/vaidation");
//Register
router.post(
  "/register",
  validationMidddleware(
    check("password")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long")
      .matches(/\d/)
      .withMessage("must contain a number")
    // check("username").isEmail()
  ),
  async (req, res, next) => {
    const { username, password, firstName, age } = req.body;

    const user = new User({
      username,
      password,
      firstName,
      age
    });
    await user.save();
    //   res.json(user)
    res.json({ message: "user was registered successfully", user });
  }
);

//Login
router.post("/login", async (req, res, next) => {
  // const username = req.body.username;
  // const password = req.body.password;
  const { username, password } = req.body;
  const user = await User.findOne({ username }).populate("posts");
  if (!user) throw new Error("Wrong username or password");
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Wrong username or password");
  const token = await user.generateToken();
  // const user = await User.findOne({ username, password }).populate("posts");
  res.json({ user, token });
});
//profile
router.get("/profile", authenticationMiddleWare, (req, res, next) => {
  res.json({
    user: req.user
  });
});
//Get
router.get("/", authenticationMiddleWare, async (req, res, next) => {
  const users = await User.find();
  const arrOfFirstNames = await users.map(el => el.firstName);
  res.json(arrOfFirstNames);
});

//Delete
router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  const deletedUser = await User.findByIdAndDelete(id);
  res.status(200).json({ message: "user is Deleted" });
});

//edit
router.patch("/:id", async (req, res, next) => {
  const id = req.params.id;
  const { username, password, firstName, age } = req.body;
  //1.
  const theUserAfterEdit = await User.findByIdAndUpdate(
    id,
    {
      username,
      password,
      firstName,
      age
    },
    {
      omitUndefined: true,
      new: true
    }
  );
  // another way
  // const user = await User.findById(id);
  // const theUserAfterEdit = await user.update(
  //   {
  //     username,
  //     password,
  //     firstName,
  //     age
  //   },
  //   {
  //     omitUndefined: true,
  //     new: true
  //   }
  // );
  res.json({
    message: "user was edited successfully",
    user: theUserAfterEdit
  });
});

module.exports = router;
