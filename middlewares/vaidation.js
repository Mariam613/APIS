const { validationResult } = require("express-validator");
const customError = require("../Helpers/customError");
module.exports = (...validationChecks) => async (req, res, next) => {
  const promises = validationChecks.map(validationCheck =>
    validationCheck.run(req)
  );
  await Promise.all(promises);
  const { errors } = validationResult(req);
  if (!errors.length) {
    return next();
  }
  throw customError("validation error", 422, errors);
  // res.status(422).json({ errors: errors.array() });
};
