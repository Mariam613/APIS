const express = require("express");
const app = express();
require("express-async-errors");
require("dotenv").config();

const db = require("./db");
const userRoute = require("./routes/user");
const postRoute = require("./routes/post");

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded());

//middleware
app.use((req, res, next) => {
  res.json({
    "request url": req.url,
    method: req.method,
    "current time": Date.now()
  });
});

app.use("/posts", postRoute);
app.use("/users", userRoute);

app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  if (statusCode >= 500) {
    return res.status(statusCode).json({
      message: "Sonmething went Wrong",
      type: "INTERNAL_SERVER_ERROR",
      details: []
    });
  } else {
    res.status(statusCode).json({
      message: err.message,
      type: err.type,
      details: err.details
    });
  }
});
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
