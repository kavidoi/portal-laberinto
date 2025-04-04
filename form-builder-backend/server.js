require('dotenv').config();
const express = require('express');
const path = require('path');
const salesRouter = require('./routes/sales');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static front-end files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount the sales API routes under /api/sales
app.use('/api/sales', salesRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
