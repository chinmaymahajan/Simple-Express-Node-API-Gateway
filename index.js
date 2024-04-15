const express = require('express');
const { HOST, PORT } = require('./src/constants');
const { rateLimitter } = require('./src/middleware/rateLimiterMiddleware');
const router = require('./src/routes/routes');

const app = express();

app.use(rateLimitter);
app.use(router);

app.listen(PORT, () => {
    console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
});
