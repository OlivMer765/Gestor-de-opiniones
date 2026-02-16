export const errorHandler = (err, req, res, next) => {
    console.error('Global Error:', err);

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            error: err.message
        });
    }

    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Duplicate Key Error',
            error: err.keyValue
        });
    }

    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message || 'Unknown error'
    });
};