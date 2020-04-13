const Post = require("../models/post");
const customError = require("../Helpers/customError");
module.exports = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const post = await Post.findById(postId);

  if (!post.userId.equals(userId)) {
    throw customError("Not Authorized", 403);
    //   err.statusCode = 403;
    //   throw err;
  }
  next();
};
