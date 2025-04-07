require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors'); // Added CORS package
const salesRouter = require('./routes/sales');
const vendorsRouter = require('./routes/vendors');
const contactosRouter = require('./routes/contactos'); // <-- Add this line


const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all requests
app.use(cors());

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static front-end files from the public folder
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Mount the sales API routes under /api/sales
app.use('/api/sales', salesRouter);

// Mount the vendors API routes under /api/vendors
app.use('/api/vendors', vendorsRouter);
app.use('/api/contactos', contactosRouter); // <-- Add this line

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
