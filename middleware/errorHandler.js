const errorHandler = (err, req, res, next) => {
  res.status(res.statusCode || 500).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV !== "production" && err.stack,
  });
};

export default errorHandler;
