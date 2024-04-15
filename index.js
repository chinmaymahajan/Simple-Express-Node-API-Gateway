const express = require('express');
const { HOST, PORT } = require('./constants');
const { rateLimitter } = require('./rateLimiterMiddleware');
const router = require('./routes');

const app = express();

app.use(rateLimitter);
app.use(router);

app.listen(PORT, () => {
    console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
});
