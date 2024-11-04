const { stack } = require("../routes/userRoutes");

const notFound = (req, res, next) => {
  const error = new Error(`not found - ${req.originalurl}`);
  res.status(404);
  next(error);
};

const ErrorHandler = (req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
  });
};

module.exports = { notFound, ErrorHandler };
