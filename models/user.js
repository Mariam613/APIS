const mongoose = require("mongoose");
const util = require("util");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 7;
const jwtSecret = process.env.JWT_SECRET;
const sign = util.promisify(jwt.sign);
const verify = util.promisify(jwt.verify);

const schema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, minlength: 3, maxlength: 15 },
    age: { type: Number, min: 13, required: false }
  },
  {
    collection: "Users",
    toJSON: {
      virtuals: true,
      transform: doc => {
        return _.pick(doc, [
          "username",
          "password",
          "firstName",
          "age",
          "id",
          "posts"
        ]);
      }
    }
  }
);
schema.virtual("posts", {
  ref: "Post",
  localField: "_id", // Find people where `localField`
  foreignField: "userId"
});
schema.pre("save", async function() {
  const userInstance = this;
  if (this.isModified("password")) {
    userInstance.password = await bcrypt.hash(
      userInstance.password,
      saltRounds
    );
  }
});
schema.methods.comparePassword = async function(plainPassword) {
  const userInstance = this;
  return bcrypt.compare(plainPassword, userInstance.password);
};
schema.methods.generateToken = async function(expiresIn = "30m") {
  const userInstance = this;
  return sign({ Id: userInstance.id }, jwtSecret, { expiresIn });
};
schema.statics.getUserFromToken = async function(token) {
  const User = this;
  const payload = await verify(token, jwtSecret);
  const currentUser = await User.findById(payload.Id);
  if (!currentUser) throw Error("user not found");
  return currentUser;
};
// await sign({ Id: "5e90fd97f1f5e804d0f66d0a" }, "thisIsMySecret", {
//   expiresIn: "30m"
// });

// await verify(
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjVlOTBmZDk3ZjFmNWU4MDRkMGY2NmQwYSIsImlhdCI6MTU4NjU3MTE2OCwiZXhwIjoxNTg2NTcyOTY4fQ.FljDjT9uIeIDTYnrVK4YKHAaV2_29G_eor_Jcst_rKk"
// );

const User = mongoose.model("User", schema);
module.exports = User;
