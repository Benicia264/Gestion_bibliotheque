const errorHandler = (err, req, res, next) => {
    console.error('Erreur :', err);

    const statusCode = err.statusCode || err.status || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Une erreur interne est survenue.',
    });
};

module.exports = errorHandler;