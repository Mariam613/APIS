const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("sucess");
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

module.exports = mongoose;
