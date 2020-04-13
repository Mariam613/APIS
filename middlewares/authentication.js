const User = require("../models/user");
const customError = require("../Helpers/customError");
module.exports = async (req, res, next) => {
  //fetch token from req.headers.authorization
  const token = req.headers.authorization;
  if (!token) throw customError("NO Authorization provided", 401);
  const currentUser = await User.getUserFromToken(token);
  req.user = currentUser;
  next();
};
