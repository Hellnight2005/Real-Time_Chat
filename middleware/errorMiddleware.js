const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // The 'err' parameter should be here
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message, // Accessing the 'err' object for error message
    stack: process.env.NODE_ENV === "production" ? null : err.stack, // Optionally include the stack trace in development
  });
};

module.exports = { notFound, errorHandler };
