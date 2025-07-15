const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || res.statusCode || 500;
    const isProduction = process.env.NODE_ENV === 'production';

    res.status(statusCode).json({
        success: false,
        message: error.message || 'Internal Server Error',
        stack: isProduction ? undefined : error.stack
    });
};

export default errorHandler;
