const mongoose = require("mongoose");
const _ = require("lodash");
const schema = new mongoose.Schema(
  {
    userId: { type: mongoose.ObjectId, ref: "User" },
    title: { type: String, required: true, min: 10, max: 20 },
    body: { type: String, required: true, min: 10, max: 500 },
    tags: { type: [String], required: false, maxlength: 10 }
  },
  {
    timestamps: true,
    virtual: true,
    collection: "Posts",
    toJSON: {
      virtuals: true,
      transform: doc => {
        return _.pick(doc, [
          "id",
          "title",
          "body",
          "tags",
          "createdAt",
          "updatedAt"
        ]);
      }
    }
  }
);
schema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id"
});
const Post = mongoose.model("Post", schema);
module.exports = Post;
