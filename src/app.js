// npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
/**
 * Imports
 */
const express = require('express');
const app = express();
const logger = require('./util/logger.js');


// Server Port and Setup
const PORT = 3000;
app.use(express.json());

// Setup logger for request calls
app.use((req, res, next) => {
    logger.info(`Incoming ${req.method} : ${req.url}`);
    next();
});

/**
 * Server
 */
app.use("/", userRouter);

// Listen to the HTTP port initiaztion
server.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`)
});