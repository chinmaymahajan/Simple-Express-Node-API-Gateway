const express = require('express');
const { rateLimitter } = require('./rateLimiterMiddleware');
const router = express.Router();
const { ERROR_CODES, STATUS } = require('./constants');

router.get('/countryName', rateLimitter)

router.use((req, res) => {
    res.status(ERROR_CODES.NOT_FOUND).json({
        code: ERROR_CODES.NOT_FOUND,
        status: STATUS.ERROR,
        message: "Route not found.",
        data: null,
    });
});

module.exports = router;
