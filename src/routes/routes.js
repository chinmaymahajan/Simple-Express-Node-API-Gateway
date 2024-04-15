const express = require('express');
const { rateLimitter } = require('../middleware/rateLimiterMiddleware');
const router = express.Router();
const { ERROR_CODES, STATUS } = require('../constants');


router.get('/countryName', rateLimitter)

router.get('/', (req, res) => {
    res.send("Add /countryName in the URL to hit the right endpoint");
});

router.use((req, res) => {
    res.status(ERROR_CODES.NOT_FOUND).json({
        code: ERROR_CODES.NOT_FOUND,
        status: STATUS.ERROR,
        message: "Route not found.",
        data: null,
    });
});

module.exports = router;
