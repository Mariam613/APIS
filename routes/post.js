const express = require("express");
const router = express.Router(); //create router
const mongoose = require("mongoose");

const Post = require("../models/post");
const authenticationMiddleWare = require("../middlewares/authentication");
const ownnerAuthorization = require("../middlewares/ownerAuthorization");

router.post("/", authenticationMiddleWare, async (req, res, next) => {
  try {
    const { userId, title, body, tags } = req.body;
    debugger;
    const post = new Post({
      userId,
      title,
      body,
      tags
    });
    await post.save();
    //   res.json(user)
    res.json({ message: "posted successfully", post });
    debugger;
  } catch (err) {
    err.statusCode = 400;
    next(err);
    // res.status(401);
  }
});
router.get("/:id", authenticationMiddleWare, async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await Post.findById(id).populate("user");
    res.status(200).json(user);
  } catch (err) {
    err.statusCode = 400;
    next(err);
  }
});
//edit
router.patch(
  "/:id",
  authenticationMiddleWare,
  ownnerAuthorization,
  async (req, res, next) => {
    const id = req.params.id;
    const { title, body, tags } = req.body;
    const thePostAfterEdit = await Post.findByIdAndUpdate(
      id,
      {
        title,
        body,
        tags
      },
      {
        omitUndefined: true,
        new: true
      }
    );

    res.json({
      message: "post was edited successfully",
      post: thePostAfterEdit
    });
  }
);
//Delete
router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  await Post.findByIdAndDelete(id);
  res.status(200).json({ message: "Post is Deleted" });
});

module.exports = router;
