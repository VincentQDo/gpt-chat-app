/**
 * @file server.js
 * @description Simple Node.js server using Express
 */

const express = require('express');

const app = express();
const port = 8080;

/**
 * Middleware to handle POST requests to '/chat'.
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
app.post('/chat', (req, res) => {
    // Your logic here
    console.log(req.body); // Assuming you're using body-parser middleware
    res.send('Received a chat message');
});

/**
 * Start the server.
 */
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
