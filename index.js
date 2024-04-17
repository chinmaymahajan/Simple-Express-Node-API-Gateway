const express = require('express');
const { HOST, PORT } = require('./src/constants');
const { rateLimitter } = require('./src/middleware/rateLimiterMiddleware');
const router = require('./src/routes/routes');

const app = express();

const hostName = process.env.HOST || HOST;
const port = process.env.PORT || PORT;

app.use(rateLimitter);
app.use(router);

app.listen(PORT, () => {
    console.log(`Application started on URL ${hostName}:${port} 🎉`);
});
